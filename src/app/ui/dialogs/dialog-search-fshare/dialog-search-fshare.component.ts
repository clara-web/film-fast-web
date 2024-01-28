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

  processSourceString(title: string, sourceStr: string): Source {
    // https://www.fshare.vn/file/PH2I4Q2VYV9E?token=1708841671
    let prefix = "https://www.fshare.vn/file/";
    if (sourceStr.startsWith(prefix)) {
      let firstQueryParamIndex = sourceStr.indexOf("?")
      let contentId = sourceStr.substring(prefix.length, firstQueryParamIndex > 0 ? firstQueryParamIndex : sourceStr.length);
      return new FShareSource(title, contentId, "auto", "auto", "auto")
    }
  }
}
