import {AfterViewInit, Directive, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, switchMap} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {Source} from "../../../data/models/source";
import {DialogData, DialogVideoPlayerComponent} from "../../dialogs/dialog-video-player/dialog-video-player.component";
import {DialogSearchYoutubeComponent} from "../../dialogs/dialog-search-youtube/dialog-search-youtube.component";
import {MediaService} from "../../../data/services/media.service";
import {Media} from "../../../data/models/media";
import {Location} from "@angular/common";

@Directive()
export abstract class BaseMediaDetailsComponent implements OnInit, AfterViewInit {
  media: Media;

  isLoading = new BehaviorSubject(true);

  protected viewContainerRef = () => {
    return undefined;
  };

  protected constructor(private service: MediaService<any, any>,
                        protected dialog: MatDialog,
                        protected router: Router,
                        private route: ActivatedRoute,
                        protected location: Location) {
  }

  ngOnInit(): void {
    console.log(`OnInit page ${this}`)
  }

  abstract onLoaded(): void

  ngAfterViewInit(): void {
    this.route.params.pipe(switchMap(value => this.service.getDetails(parseInt(value['id']))))
      .subscribe((movie) => {
        this.isLoading.next(false);
        this.media = movie;
        this.onLoaded()
      });
  }

  onBackPressed() {
    console.log(this.media.type)
    this.router.navigate([`list/${this.media.type == 'tv' ? 'show' : 'movie'}`]).then(r => console.log(r))
  }

  onPlayTrailerClick(source: Source) {
    this.dialog.open(DialogVideoPlayerComponent, {
      data: new DialogData(source),
      disableClose: true
    })
  }

  onAddTrailerClick() {
    let matDialogRef = this.dialog.open(DialogSearchYoutubeComponent, {
      data: {
        media: this.media,
        positionRelativeToElement: this.viewContainerRef()
      }
    });
    matDialogRef.afterClosed().subscribe(value => {
      if (this.media.trailers == null) {
        this.media.trailers = [];
      }
      this.media.trailers.push(...value)
      this.updateMedia();
    })
  }

  protected updateMedia() {
    this.service.set(this.media);
  }
}
