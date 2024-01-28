import {Routes} from '@angular/router';

import {MoviesComponent} from '../pages/movies/movies.component';
import {ShowsComponent} from '../pages/shows/shows.component';
import {MovieComponent} from "../pages/movie/movie.component";
import {ShowComponent} from "../pages/show/show.component";
import {PlayerComponent} from "../pages/player/player.component";
import {SeasonComponent} from "../pages/season/season.component";
import {EpisodeComponent} from "../pages/episode/episode.component";

export const MainLayoutRoutes: Routes = [
  {
    path: 'list/movie',
    component: MoviesComponent,
    data: {
      reuse: true
    }
  },
  {
    path: 'movie/:id',
    component: MovieComponent
  },
  {
    path: 'play',
    component: PlayerComponent
  },
  {
    path: 'list/show',
    component: ShowsComponent,
    data: {
      reuse: true
    }
  },
  {
    path: 'show/:id',
    component: ShowComponent,
    data: {
      reuse: true
    }
  },
  {
    path: 'show/:series_id/:ss_number/:ep_number',
    component: EpisodeComponent
  }
];
