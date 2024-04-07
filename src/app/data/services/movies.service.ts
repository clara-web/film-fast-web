import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {Movie} from '../models/movie';
import {MediaService} from './media.service';
import {UrlUtil} from "../../shared/url-util";
import {FsMedia} from "../models/fs-media";
import {FsMovie} from "../models/fs-movie";

@Injectable({providedIn: 'root'})
export class MoviesService extends MediaService<Movie, FsMedia> {
  constructor(db: AngularFirestore) {
    super(db, 'movies');
    // this.allMediaFBObservable.subscribe(value => {
    //   for (const fsEpisode of value) {
    //     if (fsEpisode instanceof FsMovie){
    //       console.log(fsEpisode.sources)
    //       for (let i = 0; i < fsEpisode.sources.length; i++) {
    //         fsEpisode.sources[i] = fsEpisode.sources[i].replaceAll("https://www.fshare.vn/file/", "fs://");
    //         fsEpisode.sources[i] = fsEpisode.sources[i].replaceAll("https://www.youtube.com/watch?v=", "yt://");
    //       }
    //       console.log(fsEpisode.sources)
    //     }
    //
    //     this.mediaCollection
    //       .doc(fsEpisode.id)
    //       .set({...JSON.parse(JSON.stringify(fsEpisode))});
    //   }
    // })
    // let collection = db.collection("movies");
    // collection.get().subscribe(value => {
    //   value.docs.forEach(doc => {
    //     collection.doc(doc.id).set({id: deleteField()}, {merge: true}).then(r => console.log(`Result ${r}`));
    //   })
    // });
  }

  searchPath(): string {
    return 'search/movie';
  }

  detailsPath(): string {
    return 'movie/';
  }

  discoverPath(): string {
    return 'discover/movie';
  }

  trendingPath(): string {
    return 'trending/movie';
  }

  nowPlayingPath(): string {
    return 'movie/now_playing';
  }

  topRatedPath(): string {
    return 'movie/top_rated';
  }

  upcomingPath(): string {
    return 'movie/upcoming';
  }

  popularPath(): string {
    return 'movie/popular';
  }

  mapFsTo(doc: any): FsMedia {
    const data = doc.data();
    return new FsMovie(doc.id,
      data.tmdbId,
      data.trailers == null ? [] : data.trailers,
      data.sources == null ? [] : data.sources);
  }

  mapApiTo(data: any): Movie {
    return new Movie(
      undefined,
      data.title,
      data.original_title,
      data.poster_path,
      data.overview,
      [],
      data.release_date,
      data.runtime,
      data.id,
      []
    );
  }

  mergeApiAndFs(mediaApi: Movie, mediaFs: FsMovie): Movie {
    mediaApi.id = mediaFs.id;
    mediaApi.trailers = mediaFs.trailers == null ? [] : mediaFs.trailers.map((v: string) => UrlUtil.parse(v));
    mediaApi.sources = mediaFs.sources == null ? [] : mediaFs.sources.map((v: string) => UrlUtil.parse(v));
    return mediaApi;
  }

  mapApiToFs(data: Movie): FsMovie {
    return JSON.parse(JSON.stringify(
      new FsMovie(data.id,
        data.tmdbId,
        data.trailers == null ? [] : data.trailers.map(value => value.shortUrl),
        data.sources == null ? [] : data.sources.map(value => value.shortUrl)
      )
    ));
  }
}
