import {Component, ElementRef, Inject} from '@angular/core';
import {MaterialsModule} from "../../materials/materials.module";
import {Media} from "../../../data/models/media";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SearchResultItem} from "../../../data/models/search_result_item";
import {
  DailymotionSource,
  FShareSource,
  GDriveSource,
  OtherSource,
  Source,
  YouTubeSource
} from "../../../data/models/source";
import {FormsModule} from "@angular/forms";
import {UrlUtil} from "../../../shared/url-util";

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

  prefix_dailymotion = "https://www.dailymotion.com/video/";
  prefix_dailymotion_short = "https://dai.ly/";
  prefix_youtube = "https://www.youtube.vn/watch";
  prefix_fshare = "https://www.fshare.vn/file/";
  prefix_gdrive = "https://drive.google.com/file/d/";

  constructor(@Inject(MAT_DIALOG_DATA)
              public options: {
    positionRelativeToElement: ElementRef,
    media: Media
  }, private dialogRef: MatDialogRef<SearchResultItem[]>) {
    this.media = options.media;
  }

  submitData() {
    let sourceStr = this.value;
    if (sourceStr.startsWith("https://")) {
      if (sourceStr.startsWith(this.prefix_gdrive)) {
        let firstSlashIndex = sourceStr.indexOf("/", this.prefix_gdrive.length);
        let contentId = sourceStr.substring(this.prefix_gdrive.length, firstSlashIndex > 0 ? firstSlashIndex : sourceStr.length);
        this.selected.push(new GDriveSource(this.media.title, contentId));
      } else if (sourceStr.startsWith(this.prefix_youtube)) {
        this.selected.push(new YouTubeSource(this.media.title, UrlUtil.getAllUrlParams(sourceStr)["v"]))
      } else if (sourceStr.startsWith(this.prefix_dailymotion) || sourceStr.startsWith(this.prefix_dailymotion_short)) {
        let firstQueryParamIndex = sourceStr.indexOf("?")
        let contentId: string;
        if (sourceStr.startsWith(this.prefix_dailymotion)) {
          contentId = sourceStr.substring(this.prefix_dailymotion.length, firstQueryParamIndex > 0 ? firstQueryParamIndex : sourceStr.length)
        } else if (sourceStr.startsWith(this.prefix_dailymotion_short)) {
          contentId = sourceStr.substring(this.prefix_dailymotion_short.length, firstQueryParamIndex > 0 ? firstQueryParamIndex : sourceStr.length)
        } else {
          console.log("Url is not valid");
          return
        }
        this.selected.push(new DailymotionSource(this.media.title, contentId));
      } else if (sourceStr.startsWith(this.prefix_fshare)) {
        let firstQueryParamIndex = sourceStr.indexOf("?")
        let contentId = sourceStr.substring(this.prefix_fshare.length, firstQueryParamIndex > 0 ? firstQueryParamIndex : sourceStr.length);
        this.selected.push(new FShareSource(this.media.title, contentId, "auto", "auto", "auto"));
      } else {
        this.selected.push(new OtherSource(this.media.title, this.value, "Auto", "Unknown", "Unknown"));
      }
      console.log(this.selected);
      this.dialogRef.close(this.selected);
    }
  }
}
