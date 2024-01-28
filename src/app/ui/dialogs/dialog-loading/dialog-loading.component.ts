import { Component } from '@angular/core';
import {MatDialogContent} from "@angular/material/dialog";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-dialog-loading',
  standalone: true,
    imports: [
        MatDialogContent,
        MatProgressSpinner
    ],
  templateUrl: './dialog-loading.component.html',
  styleUrl: './dialog-loading.component.css'
})
export class DialogLoadingComponent {

}
