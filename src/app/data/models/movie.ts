import {Media} from './media';
import {Source} from "./source";

export class Movie implements Media {
  id: string;
  type = 'movie';
  title: string;
  originalTitle: string;
  poster: string;
  overview: string;
  trailers: Source[];
  releaseDate: string;
  runtime: number;
  sources: Source[];

  smPoster: string;
  mdPoster: string;
  lgPoster: string;

  constructor(
    id: string,
    title: string,
    originalTitle: string,
    poster: string,
    overview: string,
    trailers: Source[],
    releaseDate: string,
    runtime: number,
    sources?: Source[]
  ) {
    this.id = id;
    this.title = title;
    this.originalTitle = originalTitle;
    this.overview = overview;
    this.trailers = trailers;
    this.smPoster = 'https://image.tmdb.org/t/p/w154' + poster;
    this.mdPoster = 'https://image.tmdb.org/t/p/w500' + poster;
    this.lgPoster = 'https://image.tmdb.org/t/p/w780' + poster;
    this.poster = 'https://image.tmdb.org/t/p/w342' + poster;
    this.releaseDate = releaseDate;
    this.runtime = runtime;
    this.sources = sources;
  }

  static copyOf(movie: Movie) {
    return new Movie(
      movie.id,
      movie.title,
      movie.originalTitle,
      movie.poster,
      movie.overview,
      movie.trailers,
      movie.releaseDate,
      movie.runtime,
      movie.sources
    );
  }
}
