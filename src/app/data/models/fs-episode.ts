export class FsEpisode {
  id: string;
  tmdbId: number;
  sources: string[];

  constructor(id: string, tmdbId: number, sources: string[]) {
    this.id = id;
    this.tmdbId = tmdbId;
    this.sources = sources;
  }
}
