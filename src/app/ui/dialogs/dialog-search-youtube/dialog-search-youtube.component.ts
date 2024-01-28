import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SearchResultItem} from "../../../data/models/search_result_item";
import {SearchLinkService} from "../../../data/services/search-link.service";
import {ReactiveFormsModule} from "@angular/forms";
import {MaterialsModule} from "../../materials/materials.module";
import {Media} from "../../../data/models/media";
import {DialogSearchBaseComponent} from "../dialog-search-base/dialog-search-base.component";
import {Source, YouTubeSource} from "../../../data/models/source";
import {UrlUtil} from "../../../shared/url-util";

@Component({
  selector: 'app-dialog-search-youtube',
  standalone: true,
  imports: [MaterialsModule, ReactiveFormsModule],
  templateUrl: '../dialog-search-base/dialog-search-base.component.html',
  styleUrl: '../dialog-search-base/dialog-search-base.component.css',
})
export class DialogSearchYoutubeComponent extends DialogSearchBaseComponent {
  cx: string = "c62a9dad6829c464d";

  constructor(@Inject(MAT_DIALOG_DATA) options: {
    positionRelativeToElement: ElementRef;
    media: Media
  }, dialogRef: MatDialogRef<SearchResultItem[]>, service: SearchLinkService) {
    super(options, dialogRef, service);
  }

  processSourceString(title: string, sourceStr: string): Source {
    return new YouTubeSource(title, UrlUtil.getAllUrlParams(sourceStr)["v"])
  }
}
