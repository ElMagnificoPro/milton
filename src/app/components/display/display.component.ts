import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/services/message.service';
import { CookieService } from 'ngx-cookie-service';
import { TerminalsDialogComponent } from '../terminals-dialog/terminals-dialog.component';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css'],
  providers: [MessageService],
})
export class DisplayComponent implements OnInit {
  messages: string[] = [];
  options: string[] = [];
  writing: boolean = false;
  res;
  currTerminal: string = '';

  @ViewChild('display') element: ElementRef;

  constructor(
    private _messageService: MessageService,
    private _cookieService: CookieService,
    private dialog: MatDialog
  ) {}

  openDialog() {
    const dialogRef = this.dialog.open(TerminalsDialogComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed : ', result);
      this.currTerminal = result;
      this.messages = [];
      // this.terminalNumber = result;
      this.onTerminal(result);
    });
  }

  async getMessage() {
    this.res = this._messageService.getMessage();

    console.log('from messageService', this.res);

    if (this.res) {
      this.messages.push('');
      if (this.res.options && this.res.options.length > 0) {
        if (this.res.text) {
          for (let i = 0; i < this.res.text.length; i++) {
            await this.displayMessage(this.res.text[i], 3);
            this.messages.push('');
          }
        }
        this.messages.push('');
        this.displayMessage('  >  ', 10);
        this.displayOptions();
      } else {
        for (let i = 0; i < this.res.text.length; i++) {
          await this.displayMessage(this.res.text[i], 3);
          this.messages.push('');
        }
        if (
          this.res.goto &&
          (this.res.goto === 'CLI_Resume' || this.res.goto === 'CLI_exit')
        ) {
          this.res.options = [
            {
              text: 'exit',
              next: 'CLI_Resume',
            },
          ];
          this.messages.push('');
          this.displayMessage('  >  ', 10);
          this.displayOptions();
        } else this.getMessage();
      }
    } else {
      this._messageService.resetTerminal();
      await new Promise((r) => setTimeout(r, 2000));
      this.messages = [];
      this.getMessage();
    }
  }

  async displayMessage(text, speed) {
    this.writing = true;
    let n = 0;

    while (n < text.length) {
      if (text.charAt(n) === '%') {
        //n += 3;
        let w = parseInt(text.slice(n + 2, n + 6));
        n += w.toString().length + 2;
        await new Promise((r) => setTimeout(r, w * 100));
        this.messages[this.messages.length - 1] += text.charAt(n);
      } else {
        await new Promise((r) => setTimeout(r, speed));
        this.messages[this.messages.length - 1] += text.charAt(n);
      }
      n++;
      this.scrollBottom();
    }
    this.writing = false;
  }

  onExit() {
    console.log('onExit');
    this.options = [];
    this.openDialog();
  }

  async selectChoice(option) {
    // if choice is exit => show the stuff
    this.updateFlags();
    if (option.next === 'CLI_Resume' || option.next === 'CLI_exit') {
      this.onExit();
    } else {
      this._messageService.setChoice(option);
      //this.messages.push('');
      this.options = [];
      await this.displayMessage(option.text, 30);
      if (this.res.goto === 'CLI_Resume' || this.res.goto === 'CLI_exit') {
        this.onExit();
      } else {
        this.getMessage();
      }
    }
  }

  displayOptions() {
    this.options = this.res.options;
    this.scrollBottom();
  }

  scrollBottom() {
    this.element.nativeElement.scrollTop =
      this.element.nativeElement.scrollHeight;
  }

  updateFlags() {
    let x = this._messageService.getFlags();
    //  let option.Expires = DateTime.Now.AddDays(x);
    this._cookieService.set('flags', x, 69);
    this._messageService.setFlags(x.split(','));
  }

  loadFlags() {
    let x = this._cookieService.get('flags');
    x = x ? x : '';
    this._messageService.setFlags(x.split(','));
    console.log('on loadFlags ', x);
  }

  onTerminal(n) {
    this._messageService.setTerminal(n);
    this.getMessage();
    this._messageService.postStart();
  }

  onClearSession() {
    this._messageService.clearflags();
    this._cookieService.delete('flags');
    window.location.reload();
  }

  ngOnInit(): void {
    this.loadFlags();
    this.updateFlags();
    this.openDialog();
  }
}
