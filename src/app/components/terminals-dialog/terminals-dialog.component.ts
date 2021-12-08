import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MessageService } from 'src/app/services/message.service';
import { CookieService } from 'ngx-cookie-service';

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
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    
    private _messageService: MessageService,
    private _cookieService: CookieService
  ) {}

  saveText;

  ngOnInit(): void {}

  onClearSession() {
    this._messageService.clearflags();
    this._cookieService.delete("flags")
    window.location.reload();
  }

  onSaveState(i) {
    let x = this._cookieService.get('flags');
    this._cookieService.set('flags '+i, x, 69);
  }

  onLoadState(i) {
    this._cookieService.delete('flags');
    let x = this._cookieService.get('flags ' + i);
    this._cookieService.set('flags', x, 69);
    window.location.reload();
  }

  onSaveText(){
    this.saveText = JSON.stringify(this._cookieService.getAll())
  }

  onLoadText(){
    
    
    try {
      let x = JSON.parse(this.saveText)
      this._cookieService.deleteAll();
      for (const [key, value] of Object.entries(x)) {
        this._cookieService.set(`${key}`, `${value}`, 69);
      }
      window.location.reload();
    } catch (error) {
      alert(error)
    }
  }
}
