import {Component, Inject} from '@angular/core';
import {MaterialModule} from "../../material-module";
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-edit-dialog',
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.css'
})
export class EditDialogComponent {
  editForm: FormGroup = this.fb.group({
    tweetText: ['']
  });

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    // Initialize form with data if available
    this.initializeForm();
  }

  private initializeForm() {
    if (this.data && this.data.tweetText) {
      this.editForm.patchValue({
        tweetText: this.data.tweetText
      });
    }
  }
  onNoClick(): void {
    // This will close the dialog without saving changes
    this.editForm.reset();
  }
}
