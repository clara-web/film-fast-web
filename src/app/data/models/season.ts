import {Episode} from './episode';
import {Model} from './model';

export class Season {
  tmdbId: number;
  name: string;
  number: number;
  episodeCount: number;
  episodes: Episode[] = [];

  constructor(tmdbId: number, name: string, number: number, episodeCount: number) {
    this.tmdbId = tmdbId;
    this.name = name;
    this.number = number;
    this.episodeCount = episodeCount;
  }
}
