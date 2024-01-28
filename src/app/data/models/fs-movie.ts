import {FsMedia} from "./fs-media";
import {Source} from "./source";

export class FsMovie implements FsMedia {
  id?: string;
  tmdbId: number;
  trailers: string[];
  sources: string[];

  constructor(id: string, tmdbId: number, trailers: string[], sources: string[]) {
    this.id = id;
    this.tmdbId = tmdbId;
    this.trailers = trailers;
    this.sources = sources;
  }
}
