import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {VideoPlayerModule} from "../../components/video-player/video-player.module";
import {MaterialsModule} from "../../materials/materials.module";
import {Source} from "../../../data/models/source";

@Component({
  selector: 'app-dialog-video-player',
  standalone: true,
  imports: [VideoPlayerModule, MaterialsModule],
  templateUrl: './dialog-video-player.component.html',
  styleUrl: './dialog-video-player.component.css'
})
export class DialogVideoPlayerComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

}

export class DialogData {
  constructor(public source: Source) {
  }
}
