import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VideoPlayerComponent} from "./video-player.component";
import {YouTubePlayer} from "@angular/youtube-player";


@NgModule({
  declarations: [VideoPlayerComponent],
  exports: [VideoPlayerComponent],
  imports: [CommonModule, YouTubePlayer]
})
export class VideoPlayerModule {
}
