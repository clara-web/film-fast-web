import {Source} from "./source";
import {Media} from "./media";

export class Episode implements Media {
  id?: string;
  title: string;
  originalTitle: string;
  poster: string;
  overview: string;
  trailers: Source[] = [];
  releaseDate: string;
  runtime: number;
  tmdbId?: number;
  type: string = "episode";
  number: number;
  sources: Source[];

  constructor(id: string, title: string, originalTitle: string, poster: string, overview: string, releaseDate: string, runtime: number, tmdbId: number, number: number, sources: Source[]) {
    this.id = id;
    this.title = title;
    this.originalTitle = originalTitle;
    this.poster = poster;
    this.overview = overview;
    this.trailers = [];
    this.releaseDate = releaseDate;
    this.runtime = runtime;
    this.tmdbId = tmdbId;
    this.number = number;
    this.sources = sources;
  }
}
