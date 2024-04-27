import {Media} from './media';
import {Season} from './season';
import {Source} from "./source";
import {Episode} from "./episode";

export class Show implements Media {
  id: string;
  title: string;
  originalTitle: string;
  poster: string;
  overview: string;
  trailers: Source[];
  releaseDate: string;
  runtime: number;
  type = 'tv';

  seasons: Season[];
  totalEpisodes: number;
  totalSeasons: number;

  smPoster: string;
  mdPoster: string;
  lgPoster: string;

  constructor(
    id: string,
    title: string,
    originalTitle: string,
    poster: string,
    overview: string,
    trailers: Source[],
    releaseDate: string,
    runtime: number,
    seasons: Season[],
    totalSeasons: number,
  ) {
    this.id = id;
    this.title = title;
    this.originalTitle = originalTitle;
    this.smPoster = 'https://image.tmdb.org/t/p/w154' + poster;
    this.mdPoster = 'https://image.tmdb.org/t/p/w500' + poster;
    this.lgPoster = 'https://image.tmdb.org/t/p/w780' + poster;
    this.poster = 'https://image.tmdb.org/t/p/w342' + poster;
    this.overview = overview;
    this.trailers = trailers;
    this.releaseDate = releaseDate;
    this.runtime = runtime;
    this.seasons = seasons;
    this.totalSeasons = totalSeasons;
  }

  getSeason(seasonNumber: number): Season {
    return this.seasons.find((e) => e.number == seasonNumber);
  }

  updateSeasonEpisode(seasonNumber: number, episodes: Episode[]) {
    this.seasons.find(value => value.number == seasonNumber)?.episodes?.push(...episodes)
  }

  updateSeason(season: Season) {
    for (let i = 0; i < this.seasons.length; i++) {
      if (this.seasons[i].number == season.number) {
        this.seasons[i] = season;
        break;
      }
    }
  }
}
