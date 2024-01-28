import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {MainLayoutRoutes} from './main-layout.routing';

import {MoviesComponent} from '../pages/movies/movies.component';
import {MovieComponent} from '../pages/movie/movie.component';
import {PlayerComponent} from '../pages/player/player.component';

import {ShowsComponent} from '../pages/shows/shows.component';
import {ShowComponent} from '../pages/show/show.component';
import {SeasonComponent} from "../pages/season/season.component";

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MaterialsModule} from '../materials/materials.module';
import {YouTubePlayer} from "@angular/youtube-player";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {VideoPlayerModule} from "../components/video-player/video-player.module";
import {EpisodeComponent} from "../pages/episode/episode.component";
import {MovieSourcesComponent} from "../components/movie-sources/movie-sources.component";
import {EpisodeSourcesComponent} from "../components/episode-sources/episode-sources.component";

@NgModule({
  declarations: [
    MoviesComponent,
    MovieComponent,
    PlayerComponent,
    ShowsComponent,
    ShowComponent,
    EpisodeComponent,
    EpisodeSourcesComponent,
    MovieSourcesComponent,
  ],

  imports: [
    CommonModule,
    RouterModule.forChild(MainLayoutRoutes),
    FormsModule,
    NgbModule,
    MaterialsModule,
    NgOptimizedImage,
    YouTubePlayer,
    MatProgressSpinner,
    SeasonComponent,
    VideoPlayerModule,
  ]
})
export class MainLayoutModule {
}
