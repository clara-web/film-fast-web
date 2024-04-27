import {Component} from '@angular/core';
import {BaseMediaListComponent} from "../base/base-media-list.component";
import {MoviesService} from "../../../data/services/movies.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {Media} from 'app/data/models/media';
import {Movie} from "../../../data/models/movie";

@Component({
  selector: 'movie-cmp',
  templateUrl: 'movies.component.html',
  styleUrls: ['movies.component.css'],
})
export class MoviesComponent extends BaseMediaListComponent {
  onItemClick(movie: Media) {
    this.router.navigate([`movie`, movie.id]).then(r => console.log(`Navigate to ${movie.title}`))
  };

  constructor(service: MoviesService, dialog: MatDialog, router: Router) {
    super(service, dialog, router);
  }
}
