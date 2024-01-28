import {AfterViewInit, Component, EventEmitter, OnInit} from '@angular/core';
import {Episode} from "../../../data/models/episode";
import {EpisodeService} from "../../../data/services/episode.service";
import {switchMap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Source} from "../../../data/models/source";

@Component({
  selector: 'episode-cmp',
  templateUrl: './episode.component.html',
  styleUrl: './episode.component.css'
})
export class EpisodeComponent implements OnInit, AfterViewInit {
  episode: Episode;
  isLoading = new EventEmitter();
  private seriesId: number;
  private ssNumber: number;
  private epNumber: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: EpisodeService) {
  }

  onBackPressed() {
    this.router.navigate([`show/${this.seriesId}`]).then(r => console.log(r))
  }

  ngAfterViewInit(): void {
    this.isLoading.emit(true)
    this.route.params.pipe(switchMap(value => {
      this.seriesId = parseInt(value['series_id']);
      this.ssNumber = parseInt(value['ss_number']);
      this.epNumber = parseInt(value['ep_number']);
      return this.service.get(this.seriesId, this.ssNumber, this.epNumber);
    }))
      .subscribe({
        next: (episode) => {
          this.isLoading.next(false);
          this.episode = episode;
        },
        error: (err) => {
          console.error(err);
          this.onBackPressed();
        }
      });
  }

  ngOnInit(): void {

  }

  onPreviewLink(source: Source) {
    this.router.navigate(["/play"], {
      state: {
        data: {
          title: this.episode.title,
          source: source
        }
      }
    })
      .then(value => console.log(value))
  }
}
