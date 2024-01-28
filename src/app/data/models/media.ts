import {Source} from "./source";

export interface Media {
  id?: string;
  title: string;
  originalTitle: string,
  poster: string;
  overview: string;
  trailers: Source[];
  releaseDate: string;
  runtime: number;
  tmdbId?: number;
  type: string;
}
