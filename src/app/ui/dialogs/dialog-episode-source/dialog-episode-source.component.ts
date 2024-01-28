import {Component, Inject} from '@angular/core';
import {Episode} from "../../../data/models/episode";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

export interface DialogEpData {
  episode: Episode
}

@Component({
  selector: 'app-dialog-episode-source',
  standalone: true,
  imports: [],
  templateUrl: './dialog-episode-source.component.html',
  styleUrl: './dialog-episode-source.component.css'
})
export class DialogEpisodeSourceComponent {
  constructor(@Inject(MAT_DIALOG_DATA) private data: DialogEpData) {
  }
}
