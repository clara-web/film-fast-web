import {FsMedia} from "./fs-media";
import {FsSeason} from "./fs-season";
import {Season} from "./season";
import {Source} from "./source";
import {Show} from "./show";

export class FsShow implements FsMedia {
  id?: string;
  trailers: string[];

  constructor(id: string, trailers: string[]) {
    this.id = id;
    this.trailers = trailers;
  }

  static fromShow(data: Show): FsShow {
    return new FsShow(data.id, data.trailers.map(value => value.shortUrl))
  }
}
