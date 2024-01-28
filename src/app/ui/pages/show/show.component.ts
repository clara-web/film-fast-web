import {Component, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ShowsService} from "../../../data/services/shows.service";
import {MatTabChangeEvent, MatTabGroup} from "@angular/material/tabs";
import {BaseMediaDetailsComponent} from "../base/base-media-details.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Season} from "../../../data/models/season";
import {Show} from "../../../data/models/show";
import {MoviesService} from "../../../data/services/movies.service";
import {Location} from "@angular/common";

@Component({
  selector: 'show-cmp',
  templateUrl: './show.component.html',
  styleUrl: './show.component.css',
})
export class ShowComponent extends BaseMediaDetailsComponent {

  @ViewChild(MatTabGroup) seasonTabs: MatTabGroup
  seasons!: Season[];
  show!: Show;

  constructor(service: ShowsService, dialog: MatDialog, router: Router, route: ActivatedRoute, location: Location) {
    super(service, dialog, router, route, location);
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    let season = this.seasons[tabChangeEvent.index];
    let ssNumber = season.number;
    this.location.replaceState(`show/${this.show.tmdbId}/${ssNumber}`);
  }

  isTabSelected($index: number) {
    if (this.seasonTabs == null) {
      return false;
    }
    return this.seasonTabs.selectedIndex == $index;
  }

  onLoaded() {
    this.show = (this.media as Show);
    this.seasons = (this.media as Show).seasons;
  }
}
