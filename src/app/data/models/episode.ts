import {Source} from "./source";
import {Media} from "./media";
import {FsEpisode} from "./fs-episode";

export class Episode implements Media {
  id: string;
  title: string;
  originalTitle: string;
  poster: string;
  overview: string;
  trailers: Source[] = [];
  releaseDate: string;
  runtime: number;
  type: string = "episode";
  number: number;
  sources: Source[];

  constructor(id: string, title: string, originalTitle: string, poster: string, overview: string, releaseDate: string, runtime: number, number: number, sources: Source[]) {
    this.id = id;
    this.title = title;
    this.originalTitle = originalTitle;
    this.poster = poster;
    this.overview = overview;
    this.trailers = [];
    this.releaseDate = releaseDate;
    this.runtime = runtime;
    this.number = number;
    this.sources = sources;
  }

  static fromJson(json: {
    id: string;
    name: string;
    original_name: string;
    still_path: string;
    overview: string;
    release_date: string;
    runtime: number;
    episode_number: number;
  }): Episode {
    return new Episode(
      json.id,
      json.name,
      json.original_name,
      json.still_path,
      json.overview,
      json.release_date,
      json.runtime,
      json.episode_number,
      []
    )
  }

}
