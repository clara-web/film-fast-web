import {Component, ElementRef, Inject} from '@angular/core';
import {MaterialsModule} from "../../materials/materials.module";
import {Media} from "../../../data/models/media";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SearchResultItem} from "../../../data/models/search_result_item";
import {Source} from "../../../data/models/source";
import {FormsModule} from "@angular/forms";
import {SourceType} from "../../../data/models/source-type";

@Component({
  selector: 'app-dialog-search-other',
  standalone: true,
  imports: [
    MaterialsModule,
    FormsModule
  ],
  templateUrl: './dialog-search-other.component.html',
  styleUrl: './dialog-search-other.component.css'
})
export class DialogSearchOtherComponent {
  media: Media;
  selected: Source[] = [];
  value = '';

  constructor(@Inject(MAT_DIALOG_DATA)
              public options: {
    positionRelativeToElement: ElementRef,
    media: Media
  }, private dialogRef: MatDialogRef<SearchResultItem[]>) {
    this.media = options.media;
  }

  submitData() {
    console.log(this.selected);
    this.selected.push(SourceType.determine(this.media.title, this.value));
    this.dialogRef.close(this.selected);
  }
}
