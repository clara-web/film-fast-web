import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Season} from "../../../data/models/season";
import {Show} from "../../../data/models/show";
import {MaterialsModule} from "../../materials/materials.module";
import {SearchResultItem} from "../../../data/models/search_result_item";
import {
  DailymotionSource,
  FShareSource,
  GDriveSource, HlsSource,
  OtherSource,
  Source,
  YouTubeSource
} from "../../../data/models/source";
import {UrlUtil} from "../../../shared/url-util";
import {SourceType} from "../../../data/models/source-type";

export interface DialogData {
  show: Show,
  season: Season
}

@Component({
  selector: 'app-dialog-episode-source',
  standalone: true,
  imports: [
    MaterialsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './dialog-import-episodes-source.component.html',
  styleUrl: './dialog-import-episodes-source.component.css'
})
export class DialogImportEpisodesSourceComponent {
  value: string;
  selected: Source[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) protected data: DialogData,
              private dialogRef: MatDialogRef<String[]>) {
  }

  submitData() {
    let links = this.value.split("\n");
    let episodes = this.data.season.episodes;
    if (links != null && links.length <= episodes.length) {
      let sources: Source[] = [];
      for (let i = 0; i < links.length; i++) {
        sources.push(SourceType.determine(episodes[i].title, links[i]));
      }
      this.selected.push(...sources);
      this.dialogRef.close(this.selected);
    }
  }
}
