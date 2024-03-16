import {Component, ElementRef, Inject} from '@angular/core';
import {MaterialsModule} from "../../materials/materials.module";
import {Media} from "../../../data/models/media";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SearchResultItem} from "../../../data/models/search_result_item";
import {DailymotionSource, FShareSource, OtherSource, Source, YouTubeSource} from "../../../data/models/source";
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

  dailymotion = "https://www.dailymotion.com/video/";
  dailymotion_short = "https://dai.ly/";
  youtube = "https://www.youtube.vn/watch";
  fshare = "https://www.fshare.vn/file";

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
      if (sourceStr.startsWith(this.youtube)) {
        this.selected.push(new YouTubeSource(this.media.title, UrlUtil.getAllUrlParams(sourceStr)["v"]))
      } else if (sourceStr.startsWith(this.dailymotion) || sourceStr.startsWith(this.dailymotion_short)) {
        let firstQueryParamIndex = sourceStr.indexOf("?")
        let contentId: string;
        if (sourceStr.startsWith(this.dailymotion)) {
          contentId = sourceStr.substring(this.dailymotion.length, firstQueryParamIndex > 0 ? firstQueryParamIndex : sourceStr.length)
        } else if (sourceStr.startsWith(this.dailymotion_short)) {
          contentId = sourceStr.substring(this.dailymotion_short.length, firstQueryParamIndex > 0 ? firstQueryParamIndex : sourceStr.length)
        } else {
          console.log("Url is not valid");
          return
        }
        this.selected.push(new DailymotionSource(this.media.title, contentId));
      } else if (sourceStr.startsWith(this.fshare)) {
        let firstQueryParamIndex = sourceStr.indexOf("?")
        let contentId = sourceStr.substring(this.fshare.length, firstQueryParamIndex > 0 ? firstQueryParamIndex : sourceStr.length);
        this.selected.push(new FShareSource(this.media.title, contentId, "auto", "auto", "auto"));
      } else {
        this.selected.push(new OtherSource(this.media.title, this.value, "Auto", "Unknown", "Unknown"));
      }
      console.log(this.selected);
      this.dialogRef.close(this.selected);
    }
  }
}
