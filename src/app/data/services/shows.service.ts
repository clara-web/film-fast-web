import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {map, Observable, switchMap} from 'rxjs';
import {Season} from 'app/data/models/season';
import {MediaService} from './media.service';
import {UrlUtil} from "../../shared/url-util";
import {FsShow} from "../models/fs-show";
import {Show} from "../models/show";
import {Episode} from "../models/episode";
import {EpisodeService} from "./episode.service";

@Injectable({
  providedIn: 'root',
})
export class ShowsService extends MediaService<Show, FsShow> {

  constructor(db: AngularFirestore, private episodeService: EpisodeService) {
    super(db, 'tvs');
  }

  searchPath = () => 'search/tv';

  detailsPath(): string {
    return 'tv/';
  }

  discoverPath(): string {
    return 'discover/tv';
  }

  trendingPath(): string {
    return 'trending/tv';
  }

  nowPlayingPath(): string {
    return 'tv/airing_today';
  }

  topRatedPath(): string {
    return 'tv/top_rated';
  }

  upcomingPath(): string {
    return 'tv/on_the_air';
  }

  popularPath(): string {
    return 'tv/popular';
  }

  mapFsTo(doc: any): FsShow {
    const data = doc.data();
    return new FsShow(
      doc.id,
      data.tmdbId,
      data.trailers
    );
  }

  mapApiTo(data: any): Show {
    return new Show(
      undefined,
      data.name,
      data.original_name,
      data.poster_path,
      data.overview,
      [],
      data.first_air_date,
      data.runtime,
      this.parseSeasons(data.seasons),
      data['number_of_seasons'],
      data.id
    );
  }

  private parseSeason(season: any) {
    return season == undefined ? undefined : new Season(season.id, season.name, season.season_number, season.episode_count);
  }

  private parseSeasons(seasons: any) {
    return seasons == undefined ? [] : seasons.map(s => this.parseSeason(s));
  }

  mergeApiAndFs(show: Show, fsShow: FsShow): Show {
    show.id = fsShow.id;
    show.tmdbId = fsShow.tmdbId;
    show.trailers = fsShow.trailers != null ? fsShow.trailers.map(value => UrlUtil.parse(value)) : [];
    return show;
  }

  mapApiToFs(data: Show): FsShow {
    return JSON.parse(JSON.stringify(
      new FsShow(data.id,
        data.tmdbId,
        data.trailers == null ? [] : data.trailers.map(value => value.shortUrl)
      )
    ));
  }

  getSeason(tvId: number, seasonNumber: number): Observable<Season> {
    return this.requestApi(`tv/${tvId}/season/${seasonNumber}?language=vi-VN`)
      .pipe(
        map((e) => {
          const res = e.response;
          const season = new Season(res['id'], res['name'], res['season_number'], res['episode_count']);

          season.episodes = res['episodes']
            .map(raw =>
              new Episode(
                undefined,
                raw.name,
                raw.original_name,
                raw.still_path,
                raw.overview,
                raw.release_date,
                raw.runtime,
                raw.id,
                raw.episode_number,
                []
              ));
          season.episodeCount = season.episodes.length;
          return season;
        }),
        switchMap(season =>
          this.episodeService.episodesObservable.pipe(map(fsEps => {
            season.episodes.forEach(ep => {
              let fsEp = fsEps.find(value => value.tmdbId == ep.tmdbId)
              if (fsEp != null) {
                ep.id = fsEp.id;
                ep.sources = fsEp.sources == null ? [] : fsEp.sources.map((v: string) => UrlUtil.parse(v));
              }
            })
            return season;
          })))
      );
  }
}
