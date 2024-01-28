import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import Hls from "hls.js";
import {max, min} from "@popperjs/core/lib/utils/math";
import {FShareSource, HlsSource, OtherSource, Source, YouTubeSource} from "../../../data/models/source";
import {FshareService} from "../../../data/services/fshare.service";

@Component({
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css'
})
export class VideoPlayerComponent implements AfterViewInit {
  @ViewChild('videoPlayer') videoElementRef!: ElementRef;
  @ViewChild('tubePlayer') tubeElementRef!: ElementRef;
  @ViewChild('videoContainer') videoContainerRef!: ElementRef;

  @Input() source: Source;

  constructor(private fshareService: FshareService) {
  }

  ngAfterViewInit(): void {
    let child = this.videoContainerRef.nativeElement.childNodes[0];
    child.style.width = `100%`;
    this.videoContainerRef.nativeElement.style.width = child.style.width;
    if (this.source == null) return;
    switch (this.source.scheme) {
      case 'yt://': {
        this.tubeElementRef?.nativeElement?.playVideo();
        break;
      }
      case 'fs://':
        const videoElement = this.videoElementRef?.nativeElement;
        let source = this.source as FShareSource
        this.fshareService.get(source.contentId)
          .subscribe({
            next: value => videoElement.src = value,
            error: err => console.error(err)
          });
        break;
      case 'hls://': {
        const videoElement = this.videoElementRef?.nativeElement;
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(this.source.url);
          hls.attachMedia(videoElement);
          hls.on(Hls.Events.MANIFEST_PARSED, () => videoElement.play());
        } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
          videoElement.src = this.source.url;
        }
        break;
      }
      case 'https://': {
        const videoElement = this.videoElementRef?.nativeElement;
        videoElement.src = this.source.url
        break;
      }
    }
  }

  isYouTubeUrl() {
    if (this.source == null) {
      return false;
    }
    return this.source.constructor.name == YouTubeSource.name
  }

  getYouTubeContentId() {
    return this.source instanceof YouTubeSource ? this.source.contentId : null
  }
}
