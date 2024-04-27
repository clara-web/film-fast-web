import {AngularFirestore, AngularFirestoreCollection,} from '@angular/fire/compat/firestore';
import {Media} from 'app/data/models/media';
import {ResultPage} from 'app/data/models/result_page';
import {map, Observable, switchMap} from 'rxjs';
import {AjaxResponse} from 'rxjs/ajax';
import {FsMedia} from "../models/fs-media";
import {BaseService} from "./base.service";
import {MatSnackBar} from '@angular/material/snack-bar';

export abstract class MediaService<T extends Media, F extends FsMedia> extends BaseService {
  mediaCollection: AngularFirestoreCollection<F>;

  protected constructor(protected db: AngularFirestore, path: string, protected snackBar: MatSnackBar) {
    super();
    this.mediaCollection = this.db.collection(path);
  }

  abstract searchPath(): string;

  abstract detailsPath(): string;

  abstract discoverPath(): string;

  abstract nowPlayingPath(): string;

  abstract trendingPath(): string;

  abstract topRatedPath(): string;

  abstract upcomingPath(): string;

  abstract popularPath(): string;

  abstract mapFsTo(doc: any): F;

  abstract mapApiTo(data: any): T;

  abstract mergeApiAndFs(mediaApi: T, mediaFs: F): T;

  abstract mapApiToFs(data: T): F

  update = (media: T) => this.mediaCollection
    .doc(`${media.id}`)
    .set({...JSON.parse(JSON.stringify(this.mapApiToFs(media)))})
    .then(() => this.showMessage("Update season successfully!"))
    .catch((error) => this.showMessage(`Error writing document: ${error}`));

  delete = (id: string) => this.mediaCollection.doc(id).delete()
    .then(() => this.showMessage("Delete successfully!"))
    .catch((error) => this.showMessage(`Error deleting document: ${error}`));

  getDetails(id: number): Observable<T> {
    return this.requestApi(this.detailsPath() + id + '?language=vi-VN').pipe(
      map((e) => this.mapApiTo(e.response)),
      switchMap(value => {
        return this.mediaCollection.doc(id.toString())
          .get()
          .pipe(map(doc => {
            if (doc.exists) this.mergeApiAndFs(value, this.mapFsTo(doc));
            return value
          }));
      })
    );
  }

  search(query: string, pageIndex: number): Observable<ResultPage<T>> {
    return this.processResult(
      this.requestApi(
        `${this.searchPath()}?query=${query}&include_adult=false&include_video=false&language=vi-VN&sort_by=popularity.desc&page=${pageIndex}`
      )
    );
  }

  discover(pageIndex: number): Observable<ResultPage<T>> {
    return this.processResult(
      this.requestApi(
        `${this.discoverPath()}?include_adult=false&include_video=false&language=vi-VN&sort_by=popularity.desc&page=${pageIndex}`
      )
    );
  }

  nowPlaying(pageIndex: number): Observable<ResultPage<T>> {
    return this.processResult(
      this.requestApi(
        `${this.nowPlayingPath()}?include_adult=false&include_video=false&language=vi-VN&sort_by=popularity.desc&page=${pageIndex}`
      )
    );
  }

  trending(pageIndex: number): Observable<ResultPage<T>> {
    return this.processResult(
      this.requestApi(
        `${this.trendingPath()}/day?language=vi-VN&page=${pageIndex}`
      )
    );
  }

  topRated(pageIndex: number): Observable<ResultPage<T>> {
    return this.processResult(
      this.requestApi(
        `${this.topRatedPath()}?include_adult=false&include_video=false&language=vi-VN&sort_by=popularity.desc&page=${pageIndex}`
      )
    );
  }

  popular(pageIndex: number): Observable<ResultPage<T>> {
    return this.processResult(
      this.requestApi(
        `${this.popularPath()}?include_adult=false&include_video=false&language=vi-VN&sort_by=popularity.desc&page=${pageIndex}`
      )
    );
  }

  upcoming(pageIndex: number): Observable<ResultPage<T>> {
    return this.processResult(
      this.requestApi(
        `${this.upcomingPath()}?include_adult=false&include_video=false&language=vi-VN&sort_by=popularity.desc&page=${pageIndex}`
      )
    );
  }

  private processResult(
    ob: Observable<AjaxResponse<any>>
  ): Observable<ResultPage<T>> {
    return ob.pipe(
      map((e) => {
        const response = e.response;
        const resultPage = new ResultPage<T>(
          response['page'],
          [],
          response['total_pages'],
          response['total_results']
        );
        let results = response['results'].map((element: any) => this.mapApiTo(element));
        resultPage.results.push(...results);
        return resultPage;
      }),
    );
  }

  showMessage(message: string) {
    this.snackBar.open(message, null, {
      duration: 3000
    });
  }
}
