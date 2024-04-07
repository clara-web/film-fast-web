import {Injectable} from '@angular/core';
import {BaseService, ImageSize} from "./base.service";
import {map, Observable, switchMap} from "rxjs";
import {Episode} from "../models/episode";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {FsEpisode} from "../models/fs-episode";
import {UrlUtil} from "../../shared/url-util";
import {deleteField} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class EpisodeService extends BaseService {
  episodeCollection: AngularFirestoreCollection<FsEpisode>;
  episodesObservable: Observable<FsEpisode[]>;

  constructor(db: AngularFirestore) {
    super();
    this.episodeCollection = db.collection("episodes");
    this.episodesObservable = this.episodeCollection
      .get()
      .pipe(map((ss) => ss.docs.map((doc) => {
        let data = doc.data();
        return new FsEpisode(doc.id, data.tmdbId, data.sources);
      })));
    let collection = db.collection("episodes");
    collection.get().subscribe(value => {
      value.docs.forEach(doc => {
        collection.doc(doc.id).set({id: deleteField()}, {merge: true}).then(r => console.log(`Result ${r}`));
      })
    });
    console.log("init episode service");
  }

  get(seriesId: number, seasonNumber: number, epNumber: number): Observable<Episode> {
    return this.requestApi(`tv/${seriesId}/season/${seasonNumber}/episode/${epNumber}`)
      .pipe(
        map(value => {
          let data = value.response
          return new Episode(
            undefined,
            data["name"],
            data["original_name"],
            this.parseImage(data["still_path"], ImageSize.ORIGINAL),
            data['overview'],
            data['air_date'],
            data['runtime'],
            data['id'],
            data['episode_number'],
            []
          )
        }),
        switchMap(episode => {
          return this.episodesObservable.pipe(map(fsEps => {
            let fsEp = fsEps.find(value => value.tmdbId == episode.tmdbId)
            if (fsEp != null) {
              episode.id = fsEp.id;
              episode.sources = fsEp.sources == null ? [] : fsEp.sources.map((v: string) => UrlUtil.parse(v));
            }
            return episode;
          }))
        })
      );
  }

  set(episode: Episode) {
    return this.episodeCollection
      .doc(episode.id)
      .set({...JSON.parse(JSON.stringify(this.mapApiToFs(episode)))});
  }

  delete(id: string) {
    return this.episodeCollection.doc(id).delete();
  }

  private mapApiToFs = (episode: Episode) => new FsEpisode(episode.id,
    episode.tmdbId,
    episode.sources == null ? [] : episode.sources.map(value => value.shortUrl));
}
