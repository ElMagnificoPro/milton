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
    this._messageService.deleteAllFlags();
    this._cookieService.deleteAll()
    window.location.reload();
  }

  onSaveState(i) {
    let x = this._cookieService.get('flags');
    this._cookieService.set('flags '+i, x, 69);
  }

  onLoadState(t) {

    let arr = [
      "QueryMLA","MLA_CommPortal","Milton1_1","Milton1_2","Milton2_1","Milton2_2","Milton2_3","Milton2_4","Milton2_5","Milton2_6","Milton3_1","Milton3_2","Milton3_3","Milton3_4","Milton3_5","Ending_Tower","Ending_Crypt","Ending_Gates","MiltonTower1","MiltonTower2",
    ].map(v=> 'flags ' + v)

    this._cookieService.delete('flags');
    let x = this._cookieService.get('flags ' + t);
    this._cookieService.set('flags', x, 69);

    for (let i = arr.indexOf('flags ' + t) + 1; i < arr.length; i++) {
      this._cookieService.delete(arr[i]);
    }
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


  isDisabled(terminal){
    let flags = this._cookieService.get('flags');
    if (flags.includes(terminal)) {
      return false;
    }
    return true;
  }
}