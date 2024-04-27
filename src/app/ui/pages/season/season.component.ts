import {AfterViewInit, Component, Input} from '@angular/core';
import {Show} from "../../../data/models/show";
import {MatTableDataSource} from "@angular/material/table";
import {Episode} from "../../../data/models/episode";
import {MaterialsModule} from "../../materials/materials.module";
import {ShowsService} from "../../../data/services/shows.service";
import {Router} from "@angular/router";
import {DialogSearchOtherComponent} from "../../dialogs/dialog-search-other/dialog-search-other.component";
import {MatDialog} from "@angular/material/dialog";
import {MatBadge} from "@angular/material/badge";
import {Season} from "../../../data/models/season";
import {
  DialogImportEpisodesSourceComponent
} from "../../dialogs/dialog-import-episodes-source/dialog-import-episodes-source.component";
import {delay} from "rxjs";

@Component({
  selector: 'season-cmp',
  standalone: true,
  imports: [
    MaterialsModule,
    MatBadge
  ],
  templateUrl: './season.component.html',
  styleUrl: './season.component.css'
})
export class SeasonComponent implements AfterViewInit {

  @Input() show: Show
  @Input() seasonNumber: number

  displayedColumns: string[] = ['no', 'name', 'action'];

  seasonDetail: Season;
  episodes: Episode[] = [];
  dataSource = new MatTableDataSource<Episode>(this.episodes);

  constructor(private service: ShowsService, private dialog: MatDialog, private router: Router,) {
  }

  ngAfterViewInit(): void {
    this.service.getSeason(this.show, this.seasonNumber)
      .subscribe({
        next: (v) => {
          this.seasonDetail = v;
          this.episodes = v.episodes
          this.show.updateSeasonEpisode(this.seasonNumber, v.episodes);
          this.dataSource = new MatTableDataSource(this.episodes)
        },
      })
  }

  openEpisodeDetails(epNumber: number) {
    this.router.navigate([`show/${this.show.id}/${this.seasonNumber}/${epNumber}`])
      .then(value => console.log(value))
  }

  playEpisode(index: number) {
    this.router.navigate(["/play"], {
      state: {
        data: {
          title: this.show.title,
          source: "source"
        }
      }
    })
      .then(value => console.log(value))
  }


  addLink(ep: Episode) {
    return this.openDialog(ep);
  }

  private openDialog(ep: Episode) {
    this.dialog.open(DialogSearchOtherComponent, {
      data: {
        media: ep
      },
      width: '50vw'
    }).afterClosed().subscribe(async value => {
      if (ep.sources == undefined) {
        ep.sources = [];
      }
      if (value?.length > 0) {
        ep.sources.push(...value);
        for (const season of this.show.seasons) {
          if (season.number == this.seasonNumber) {
            for (let i = 0; i < season.episodes.length; i++) {
              if (season.episodes[i].id == ep.id) {
                season.episodes[i] = ep;
                await this.service.update(this.show);
                break;
              }
            }
          }
        }
      }
    })
  }

  deleteSource(srcIndex: number) {
    // this.dialog.open(DialogDeleteConfirmationComponent, {
    //   data: this.media.sources[srcIndex].url
    // }).afterClosed().subscribe(async value => {
    //   if (value == true) {
    //     this.media.sources.splice(srcIndex, 1)
    //     this.dataSource.data = this.media.sources;
    //     await this.update(this.media);
    //   }
    // })
  }

  imports() {
    this.dialog.open(DialogImportEpisodesSourceComponent, {
      width: "50vw",
      data: {
        show: this.show,
        season: this.seasonDetail
      },
    },)
      .afterClosed()
      .subscribe(async value => {
        this.seasonDetail.updateEpisodeLink(value)
        this.show.updateSeason(this.seasonDetail);
        await this.service.updateSeason(this.show, this.seasonNumber);
      })
  }
}
