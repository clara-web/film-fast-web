import {FsMedia} from "./fs-media";
import {FsSeason} from "./fs-season";

export class FsShow implements FsMedia {
  id?: string;
  tmdbId: number;
  trailers: string[];
  seasons: FsSeason[];

  constructor(id: string, tmdbId: number, trailers: string[]) {
    this.id = id;
    this.tmdbId = tmdbId;
    this.trailers = trailers;
  }
}
