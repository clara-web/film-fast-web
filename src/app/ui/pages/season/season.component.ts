import {AfterViewInit, Component, Input} from '@angular/core';
import {Show} from "../../../data/models/show";
import {MatTableDataSource} from "@angular/material/table";
import {Episode} from "../../../data/models/episode";
import {MaterialsModule} from "../../materials/materials.module";
import {ShowsService} from "../../../data/services/shows.service";
import {Source} from "../../../data/models/source";
import {Router} from "@angular/router";
import {map} from "rxjs";

@Component({
  selector: 'season-cmp',
  standalone: true,
  imports: [
    MaterialsModule
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

  constructor(private service: ShowsService, private router: Router) {
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
}
