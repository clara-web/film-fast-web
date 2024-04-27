import {Component, ElementRef, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SearchResultItem} from "../../../data/models/search_result_item";
import {SearchLinkService} from "../../../data/services/search-link.service";
import {ReactiveFormsModule} from "@angular/forms";
import {MaterialsModule} from "../../materials/materials.module";
import {Media} from "../../../data/models/media";
import {DialogSearchBaseComponent} from "../dialog-search-base/dialog-search-base.component";
import {FShareSource, Source} from "../../../data/models/source";

@Component({
  selector: 'app-dialog-search-fshare',
  standalone: true,
  imports: [MaterialsModule, ReactiveFormsModule],
  templateUrl: '../dialog-search-base/dialog-search-base.component.html',
  styleUrl: '../dialog-search-base/dialog-search-base.component.css',
})
export class DialogSearchFshareComponent extends DialogSearchBaseComponent {
  cx = "77cb986d502384315";

  constructor(@Inject(MAT_DIALOG_DATA) options: {
                positionRelativeToElement: ElementRef;
                media: Media
              },
              dialogRef: MatDialogRef<SearchResultItem[]>,
              service: SearchLinkService) {
    super(options, dialogRef, service);
  }
}
