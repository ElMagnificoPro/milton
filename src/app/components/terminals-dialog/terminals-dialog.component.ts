import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  terminal: number;
}

@Component({
  selector: 'app-terminals-dialog',
  templateUrl: './terminals-dialog.component.html',
  styleUrls: ['./terminals-dialog.component.css'],
})
export class TerminalsDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<TerminalsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {}
}
