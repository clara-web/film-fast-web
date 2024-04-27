import {Episode} from "./episode";

export class FsEpisode {
  number: number;
  sources: string[];

  constructor(number: number, sources: string[]) {
    this.number = number;
    this.sources = sources;
  }

  static fromEpisode(episode: Episode): FsEpisode {
    let sources: string[] = [];
    if (episode.sources.length > 0) {
      episode.sources.forEach(source => {
        if (source != null && source.shortUrl.length > 0) {
          sources.push(source.shortUrl);
        }
      })
    }
    return new FsEpisode(episode.number, sources);
  }
}
