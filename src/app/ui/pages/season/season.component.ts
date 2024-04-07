import {AfterViewInit, Component, Input} from '@angular/core';
import {Show} from "../../../data/models/show";
import {MatTableDataSource} from "@angular/material/table";
import {Episode} from "../../../data/models/episode";
import {MaterialsModule} from "../../materials/materials.module";
import {ShowsService} from "../../../data/services/shows.service";
import {Source} from "../../../data/models/source";
import {Router} from "@angular/router";
import {DialogSearchOtherComponent} from "../../dialogs/dialog-search-other/dialog-search-other.component";
import {
  DialogDeleteConfirmationComponent
} from "../../dialogs/dialog-delete-confirmation/dialog-delete-confirmation.component";
import {MatDialog} from "@angular/material/dialog";
import {EpisodeService} from "../../../data/services/episode.service";
import {MatBadge} from "@angular/material/badge";

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

  episodes: Episode[] = [];
  dataSource = new MatTableDataSource<Episode>(this.episodes);

  constructor(private service: ShowsService, private dialog: MatDialog, private epService: EpisodeService, private router: Router,) {
  }

  ngAfterViewInit(): void {
    this.service.getSeason(this.show.tmdbId, this.seasonNumber)
      .subscribe({
        next: (v) => {
          this.episodes = v.episodes
          this.show.updateSeasonEpisode(this.seasonNumber, v.episodes)
          this.dataSource = new MatTableDataSource(this.episodes)
        },
        error: (err) => {
          console.log(err)
        },
      })
  }

  printSourceInShort(sources: Source[]) {
    return sources.map(s => s.shortUrl).join(", ");
  }

  openEpisodeDetails(epNumber: number) {
    this.router.navigate([`show/${this.show.tmdbId}/${this.seasonNumber}/${epNumber}`])
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
        ep.sources.push(...value)
        await this.epService.set(ep);
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
}
