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

  constructor(db: AngularFirestore) {
    super();
    // let collection = db.collection("episodes");
    // collection.get().subscribe(value => {
    //   value.docs.forEach(doc => {
    //     collection.doc(doc.id).set({id: deleteField()}, {merge: true}).then(r => console.log(`Result ${r}`));
    //   })
    // });
    console.log("init episode service");
  }

  get(seriesId: number, seasonNumber: number, epNumber: number): Observable<Episode> {
    return this.requestApi(`tv/${seriesId}/season/${seasonNumber}/episode/${epNumber}`)
      .pipe(
        map(value => {
          let data = value.response
          return new Episode(
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
      );
  }
}
