import {FsEpisode} from "./fs-episode";
import {Season} from "./season";

export class FsSeason {
  number: number;
  episodes: FsEpisode[] = [];


  constructor(number: number, episodes: FsEpisode[]) {
    this.number = number;
    this.episodes = episodes;
  }

  static fromSeason(value: Season): FsSeason {
    let episodes = (value.episodes == null) ? [] : value.episodes.map(episode => FsEpisode.fromEpisode(episode));
    return new FsSeason(value.number, episodes);
  }
}
