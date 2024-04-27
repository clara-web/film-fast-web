import {FsMedia} from "./fs-media";
import {Source} from "./source";

export class FsMovie implements FsMedia {
  id: string;
  trailers: string[];
  sources: string[];

  constructor(id: string, trailers: string[], sources: string[]) {
    this.id = id;
    this.trailers = trailers;
    this.sources = sources;
  }
}
