import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {map, Observable, switchMap} from 'rxjs';
import {Season} from 'app/data/models/season';
import {MediaService} from './media.service';
import {UrlUtil} from "../../shared/url-util";
import {FsShow} from "../models/fs-show";
import {Show} from "../models/show";
import {FsSeason} from "../models/fs-season";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root',
})
export class ShowsService extends MediaService<Show, FsShow> {

  constructor(db: AngularFirestore, snackBar: MatSnackBar) {
    super(db, "tvs", snackBar);
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
    return new FsShow(doc.id, data.trailers);
  }

  mapApiTo(data: any): Show {
    return new Show(
      data.id,
      data.name,
      data.original_name,
      data.poster_path,
      data.overview,
      [],
      data.first_air_date,
      data.runtime,
      this.parseSeasons(data.seasons),
      data['number_of_seasons'],
    );
  }

  private parseSeason(season: any) {
    return season == undefined ? undefined : new Season(season.id, season.name, season.season_number, season.episode_count);
  }

  private parseSeasons(seasons: any) {
    return seasons == undefined ? [] : seasons.map(s => this.parseSeason(s));
  }

  mergeApiAndFs(show: Show, fsShow: FsShow): Show {
    show.trailers = fsShow.trailers != null ? fsShow.trailers.map(value => UrlUtil.parse(value)) : [];
    return show;
  }

  mapApiToFs(data: Show): FsShow {
    return FsShow.fromShow(data);
  }

  async updateSeason(show: Show, seasonNumber: number) {
    let fsSeason = FsSeason.fromSeason(show.getSeason(seasonNumber));
    await this.mediaCollection
      .doc(show.id.toString())
      .collection("seasons")
      .doc(seasonNumber.toString())
      .set({...JSON.parse(JSON.stringify(fsSeason))})
      .then(() => this.showMessage("Update season successfully!"))
      .catch((error) => this.showMessage(`Error writing document: ${error}`));
  }

  getSeason(show: Show, seasonNumber: number): Observable<Season> {
    return this.requestApi(`tv/${show.id}/season/${seasonNumber}?language=vi-VN`)
      .pipe(
        map((e) => Season.fromJson(e.response)),
        switchMap(season =>
          this.db.collection("tvs")
            .doc(show.id.toString())
            .collection("seasons")
            .doc(seasonNumber.toString())
            .get()
            .pipe(map(value => {
              let data = value.data();
              if (data == null) {
                return season;
              }
              let fsSeason = new FsSeason(data.number, data.episodes);
              if (fsSeason.episodes.length > 0) {
                for (let episode of season.episodes) {
                  for (let fsEpisode of fsSeason.episodes) {
                    if (episode.number == fsEpisode.number) {
                      episode.sources = fsEpisode.sources.map(value => UrlUtil.parse(value))
                    }
                  }
                }
              }
              return season;
            })))
      );
  }
}
