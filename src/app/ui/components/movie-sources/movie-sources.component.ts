import {Component, Input} from '@angular/core';
import {SourcesComponent} from "../base/sources.component";
import {MatDialog} from "@angular/material/dialog";
import {MoviesService} from "../../../data/services/movies.service";
import {Movie} from "../../../data/models/movie";

@Component({
    selector: 'movie-sources-cmp',
    templateUrl: './movie-sources.component.html',
    styleUrl: './movie-sources.component.css'
})
export class MovieSourcesComponent extends SourcesComponent<Movie> {

    constructor(dialog: MatDialog, private service: MoviesService) {
        super(dialog);
    }

    update = (movie: Movie) => this.service.update(movie);
}
