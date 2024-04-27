import {Component} from '@angular/core';
import {BaseMediaListComponent} from "../base/base-media-list.component";
import {ShowsService} from "../../../data/services/shows.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {Media} from "../../../data/models/media";

@Component({
  selector: 'shows-cmp',
  templateUrl: 'shows.component.html',
  styleUrls: ['shows.component.css'],
})
export class ShowsComponent extends BaseMediaListComponent {

  constructor(service: ShowsService, dialog: MatDialog, router: Router) {
    super(service, dialog, router);
  }

  onItemClick(show: Media) {
    this.router.navigate([`show`, show.id]).then(r => console.log(`Navigate to ${show.title}`))
  };
}
