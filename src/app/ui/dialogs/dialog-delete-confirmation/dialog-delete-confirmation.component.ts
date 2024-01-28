import {Component, Inject} from '@angular/core';
import {MaterialsModule} from "../../../shared/material/materials.module";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SearchResultItem} from "../../../data/models/search_result_item";

@Component({
  selector: 'dialog-delete-confirmation-cmp',
  standalone: true,
  imports: [MaterialsModule],
  templateUrl: './dialog-delete-confirmation.component.html',
  styleUrl: './dialog-delete-confirmation.component.css'
})
export class DialogDeleteConfirmationComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private dialogRef: MatDialogRef<boolean>,
  ) {
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
