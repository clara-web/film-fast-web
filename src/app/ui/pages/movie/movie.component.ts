import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MoviesService} from 'app/data/services/movies.service';
import {ActivatedRoute, Router} from "@angular/router";
import {BaseMediaDetailsComponent} from "../base/base-media-details.component";
import {Movie} from "../../../data/models/movie";
import {Source} from "../../../data/models/source";
import {Location} from "@angular/common";

@Component({
  selector: 'movie-details-cmp',
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css',
})
export class MovieComponent extends BaseMediaDetailsComponent {
  movie!: Movie
  @ViewChild("body") body: ViewContainerRef

  onLoaded() {
    this.movie = this.media as Movie;
  }

  viewContainerRef = () => this.body;


  constructor(service: MoviesService, dialog: MatDialog, router: Router, route: ActivatedRoute, location: Location) {
    super(service, dialog, router, route, location);
  }

  onPreviewLink(source: Source) {
    this.router.navigate(["/play"], {
      state: {
        data: {
          title: this.movie.title,
          source: source
        }
      }
    })
      .then(value => console.log(value))
  }
}
