import {AngularFirestore, AngularFirestoreCollection,} from '@angular/fire/compat/firestore';
import {Media} from 'app/data/models/media';
import {ResultPage} from 'app/data/models/result_page';
import {map, mergeMap, Observable} from 'rxjs';
import {ajax, AjaxResponse} from 'rxjs/ajax';
import {FsMedia} from "../models/fs-media";
import {BaseService} from "./base.service";

export abstract class MediaService<T extends Media, F extends FsMedia> extends BaseService {
  mediaCollection: AngularFirestoreCollection<F>;
  allMediaFBObservable: Observable<F[]>;

  protected constructor(private db: AngularFirestore, path: string) {
    super();
    this.mediaCollection = this.db.collection(path);
    this.allMediaFBObservable = this.mediaCollection
      .get()
      .pipe(map((ss) => ss.docs.map((doc) => this.mapFsTo(doc))));
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

  set = (media: T) => this.mediaCollection
    .doc(media.id)
    .set({...JSON.parse(JSON.stringify(this.mapApiToFs(media)))});

  delete = (id: string) => this.mediaCollection.doc(id).delete();

  protected requestApi(path: string) {
    return ajax({
      url: `https://api.themoviedb.org/3/${path}`,
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YjIwODk3ZDQzODFmNzMzODA5YmEzM2U5MWVjNTFlNyIsInN1YiI6IjVjNzUyZTUwYzNhMzY4NDg0NmQyZjNiMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9QxKqV41Mu7G48hGdq3dQ8hWUZiGr92xZrwbBwyEsYM',
      },
    });
  }

  getDetails(id: number): Observable<T> {
    return this.requestApi(this.detailsPath() + id + '?language=en-US').pipe(
      map((e) => this.mapApiTo(e.response)),
      mergeMap((m) =>
        this.allMediaFBObservable.pipe(
          map((medias) => {
            const media = medias.find((media) => media.tmdbId == id);
            if (media != undefined) {
              this.mergeApiAndFs(m, media);
            }
            return m;
          }),
        ),
      )
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
        response['results'].forEach((element) => {
          resultPage.results.push(this.mapApiTo(element));
        });
        return resultPage;
      }),
      mergeMap((resultPage) =>
        this.allMediaFBObservable.pipe(
          map((medias) => {
            resultPage.results.forEach((m) => {
              const media = medias.find((media) => media.tmdbId == m.tmdbId);
              if (media != undefined) {
                this.mergeApiAndFs(m, media);
              }
            });
            return resultPage;
          })
        )
      )
    );
  }
}
