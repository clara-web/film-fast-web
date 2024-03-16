import {AfterViewInit, Directive, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from "@angular/material/dialog";
import {DialogSearchOtherComponent} from "../../dialogs/dialog-search-other/dialog-search-other.component";
import {DialogSearchYoutubeComponent} from "../../dialogs/dialog-search-youtube/dialog-search-youtube.component";
import {DialogSearchFshareComponent} from "../../dialogs/dialog-search-fshare/dialog-search-fshare.component";
import {ComponentType} from "@angular/cdk/overlay";
import {Source} from "../../../data/models/source";
import {
  DialogDeleteConfirmationComponent
} from "../../dialogs/dialog-delete-confirmation/dialog-delete-confirmation.component";
import {SourceList} from "../../../data/models/source-list";
import {Media} from "../../../data/models/media";

@Directive()
export abstract class SourcesComponent<T extends Media & SourceList> implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['no', 'name', 'url', 'quality', 'audio', 'subtitle', 'action'];
  dataSource = new MatTableDataSource<Source>([]);
  @Input() media: T;
  @Output() onPreviewClick = new EventEmitter()

  constructor(private dialog: MatDialog) {
  }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.media.sources != undefined) {
      this.dataSource.data = this.media.sources;
    }
  }

  previewLink(source: Source) {
    this.onPreviewClick.emit(source);
  }

  addLinkFShare = () => this.openDialog(DialogSearchFshareComponent);

  addLinkYouTube = () => this.openDialog(DialogSearchYoutubeComponent);

  addLinkOther = () => this.openDialog(DialogSearchOtherComponent);

  private openDialog<T>(component: ComponentType<T>) {
    this.dialog.open(component, {
      data: {
        media: this.media
      },
      width: '50vw'
    }).afterClosed().subscribe(value => {
      if (this.media.sources == undefined) {
        this.media.sources = [];
      }
      if (value?.length > 0) {
        this.media.sources.push(...value)
        this.dataSource.data = this.media.sources;
        this.update(this.media)
      }
    })
  }

  deleteSource(srcIndex: number) {
    this.dialog.open(DialogDeleteConfirmationComponent, {
      data: this.media.sources[srcIndex].url
    }).afterClosed().subscribe(value => {
      if (value == true) {
        this.media.sources.splice(srcIndex, 1)
        this.dataSource.data = this.media.sources;
        this.update(this.media)
      }
    })
  }

  abstract update: (t: T) => any;
}
