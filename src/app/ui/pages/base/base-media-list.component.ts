import {AfterViewInit, Directive, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ResultPage} from '../../../data/models/result_page';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {debounceTime, distinctUntilChanged, filter, map, startWith, switchMap,} from 'rxjs/operators';
import {BehaviorSubject, merge, Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogLoadingComponent} from "../../dialogs/dialog-loading/dialog-loading.component";
import {Router} from "@angular/router";
import {MatSelect} from "@angular/material/select";
import {MediaService} from "../../../data/services/media.service";
import {Media} from "../../../data/models/media";

export interface ListType {
  type: number;
  text: string;
}

export class Options {
  startIndex: number;
  startKeyword: string;
  startListType: ListType;

  constructor(startIndex: number, startKeyword: string, listType: ListType) {
    this.startIndex = startIndex;
    this.startKeyword = startKeyword;
    this.startListType = listType;
  }
}

@Directive()
export abstract class BaseMediaListComponent implements OnInit, AfterViewInit, OnDestroy {
  movieListTypes: ListType[] = [
    {type: 1, text: 'Trending'},
    {type: 4, text: 'Now playing'},
    {type: 0, text: 'Discover'},
    {type: 2, text: 'Popular'},
    {type: 3, text: 'Top Rated'},
    {type: 5, text: 'Upcoming'},
  ];
  mediaList: Media[] = [];
  dataSource = new MatTableDataSource<Media>(this.mediaList);
  itemsCount = 0;
  isLoading = new BehaviorSubject(true);
  searchCtrl = new FormControl();
  listTypesCtrl = new FormControl<ListType>(
    this.movieListTypes[0]
  );
  loadingDialogRef: MatDialogRef<DialogLoadingComponent>


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('matSelect') matSelect: MatSelect;

  protected constructor(private service: MediaService<any, any>,
                        private dialog: MatDialog,
                        protected router: Router) {
  }

  ngOnInit(): void {
    console.log(`init ${this}`)
  }

  ngOnDestroy() {
    console.log(`destroy ${this}`)
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.isLoading.subscribe(value => {
      if (this.loadingDialogRef != null) {
        if (value) {
          return
        } else {
          this.loadingDialogRef.close();
          this.loadingDialogRef = null;
        }
      }
      if (value) {
        this.loadingDialogRef = this.dialog.open(DialogLoadingComponent, {
          disableClose: true
        });
      }
    })
    this.fetchMediaList();
  }

  private fetchMediaList() {
    merge(
      this.listTypesCtrl.valueChanges,
      this.searchCtrl.valueChanges.pipe(
        filter((res) => res !== null && res.length >= 2),
        distinctUntilChanged(),
        debounceTime(300),
        map((value) => {
          this.paginator.pageIndex = 0;
          return value;
        })
      ),
      this.paginator.page.pipe(map((value: PageEvent) => value.pageIndex))
    )
      .pipe(
        startWith(this.defaultOptions()),
        switchMap((value) => {
          if (value.constructor.name == Options.name) {
            if (value.startKeyword != null && value.startKeyword.length > 0) {
              return this.service.search(this.searchCtrl.value, value.startIndex + 1);
            } else {
              return this.movieListByType(value.startListType, value.startIndex + 1)
            }
          } else if (value == this.paginator.pageIndex) {
            let pageIndex = Number(value)
            if (this.searchCtrl.value != null && this.searchCtrl.value.length > 0) {
              return this.service.search(this.searchCtrl.value, pageIndex + 1);
            } else {
              this.isLoading.next(true);
              return this.movieListByType(this.listTypesCtrl.value, pageIndex + 1);
            }
          } else if (value == this.searchCtrl.value && String(value).length > 0) {
            return this.service.search(this.searchCtrl.value, 1);
          } else if (value == this.listTypesCtrl.value) {
            this.isLoading.next(true);
            return this.movieListByType(this.listTypesCtrl.value, 1);
          } else {
            return new Observable<ResultPage<Media>>(subscriber => {
              subscriber.next(new ResultPage<Media>(0, [], 0, 0))
            })
          }
        }),
        map((page) => {
          this.isLoading.next(false);
          if (page == null) return [];
          this.itemsCount = page.totalResults;
          return page.results;
        })
      )
      .subscribe((mediaList) => {
        this.mediaList = mediaList;
        this.dataSource = new MatTableDataSource(this.mediaList);
      });
  }

  private defaultOptions(): Options {
    return new Options(0, null, this.movieListTypes[0]);
  }

  private movieListByType = (listType: ListType, pageIndex: number): Observable<ResultPage<Media>> => {
    switch (listType.type) {
      case 1:
        return this.service.trending(pageIndex);
      case 2:
        return this.service.popular(pageIndex);
      case 3:
        return this.service.topRated(pageIndex);
      case 4:
        return this.service.nowPlaying(pageIndex);
      case 5:
        return this.service.upcoming(pageIndex);
      default:
        return this.service.discover(pageIndex);
    }
  };

  abstract onItemClick(media: Media): void;
}
