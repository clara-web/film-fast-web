import {Component} from '@angular/core';
import {Source} from "../../../data/models/source";
import {Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'movie-player-cmp',
  templateUrl: './player.component.html',
  styleUrl: './player.component.css'
})
export class PlayerComponent {
  source: Source;
  title: string;

  constructor(private router: Router, private location: Location) {
    let data = this.router.getCurrentNavigation()?.extras?.state?.['data'];
    if (!data) {
      this.onBackPressed();
      return;
    }
    this.title = data.title
    this.source = data.source;
  }

  onBackPressed() {
    this.location.back();
  }
}
