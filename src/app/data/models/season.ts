import {Episode} from './episode';
import {Source} from "./source";

export class Season {
  id: string;
  number: number;
  name: string;
  episodeCount: number;
  episodes: Episode[] = [];

  constructor(id: string, name: string, number: number, episodeCount: number) {
    this.id = id;
    this.name = name;
    this.number = number;
    this.episodeCount = episodeCount;
  }

  static fromJson(res) {
    const season = new Season(res['id'], res['name'], res['season_number'], res['episode_count']);
    season.episodes = res['episodes'].map(raw => Episode.fromJson(raw));
    season.episodeCount = season.episodes.length;
    return season
  }

  updateEpisodeLink(sources: Source[]) {
    let episodes = this.episodes;
    for (let j = 0; j < sources.length; j++) {
      if (episodes[j].sources == undefined) {
        episodes[j].sources = [];
      }
      episodes[j].sources.push(sources[j]);
    }
  }
}
