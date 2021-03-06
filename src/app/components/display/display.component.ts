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
  options = [];
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
      this.currTerminal = result;
      this.messages = [];
      this.onTerminal(result);
    });
  }

  async getMessage() {
    this.res = this._messageService.getMessage();

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

    //speed Multiplier (quicker for testing)
    //speed=0;

    while (n < text.length) {
      if (text.charAt(n) === '%') {
        let w = parseInt(text.slice(n + 2, n + 6));
        n += w.toString().length + 2;
        await new Promise((r) => setTimeout(r, w * speed * 30));
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
    let x = this._cookieService.get('flags');
    this._cookieService.set('flags '+this.currTerminal, x, 69);

    this.options = [];
    this.openDialog();
  }

  async selectChoice(option) {
    // if choice is exit => show the stuff
    if (option.set) {
      this._messageService.setFlags(option.set.split(' '));
    }
    if (option.clear) {
      this._messageService.clearFlags(option.clear.split(' '));
    }
    this.updateFlags();
    if (option.next === 'CLI_Resume' || option.next === 'CLI_exit') {
      this.onExit();
    } else {
      this._messageService.setChoice(option);
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
    
    document.documentElement.scrollTop =document.documentElement.scrollHeight;
    document.body.scrollTop =document.body.scrollHeight;
  }

  scrollBottom() {
    this.element.nativeElement.scrollTop =
      this.element.nativeElement.scrollHeight;

  }

  updateFlags() {
    let x = this._messageService.getFlags();
    this._cookieService.set('flags', x, 69); //lol
    this._messageService.setFlags(x.split(','));
  }

  loadFlags() {
    let x = this._cookieService.get('flags');
    x = x ? x : '';
    this._messageService.setFlags(x.split(','));
  }

  onTerminal(n) {
    this._messageService.setTerminal(n);
    this.getMessage();
    this._messageService.postStart();

    this.element.nativeElement.scrollTop = 0;
    document.documentElement.scrollTop =0;
    document.body.scrollTop =0;
  }

  ngOnInit(): void {
    this.loadFlags();
    this.updateFlags();
    this.openDialog();
  }
}
