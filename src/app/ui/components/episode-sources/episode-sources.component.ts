import {Component} from '@angular/core';
import {SourcesComponent} from "../base/sources.component";
import {MatDialog} from "@angular/material/dialog";
import {EpisodeService} from "../../../data/services/episode.service";
import {Episode} from "../../../data/models/episode";

@Component({
  selector: 'episode-sources-cmp',
  templateUrl: './episode-sources.component.html',
  styleUrl: './episode-sources.component.css'
})
export class EpisodeSourcesComponent extends SourcesComponent<Episode> {
  constructor(dialog: MatDialog, private service: EpisodeService) {
    super(dialog);
  }

  update = (episode: Episode) => {
  };
}

