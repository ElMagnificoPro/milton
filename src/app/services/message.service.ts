import { Injectable } from '@angular/core';
import StoriesJson from '../../assets/json/stories.js';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  index: number = 0;
  story; 
  flags = new Set();
  currentLabel: string = '';
  showTerminals: boolean = false;
  toDisplay;

  getMessage() {
    this.toDisplay = {};
    this.toDisplay.text = [];
    this.toDisplay.options = [];

    let hasNext = '';

    for (let i = 0; i < this.story.length; i++) {
      const e = this.story[i];
      if (this.parseLabel(e.condition) && e.display === 'terminal') {
        if (e.text) this.toDisplay.text.push(...e.text);
        if (e.options) this.toDisplay.options.push(...e.options);
        if (e.set) this.setFlags(e.set.split(' '));

        if (e.next) {
          this.setFlags([e.next]);
          hasNext = e.next;
        }

        if (e.goto) {
          this.toDisplay.goto = e.goto;
          this.gotoLabel(e.goto);
        }

        if (e.clear)
          e.clear.split(' ').map((v) => {
            this.flags.delete(v);
          });
      }
    }
    for (let i = 0; i < this.story.length; i++) {
      const e = this.story[i];
      if (this.parseLabel(e.condition) && e.display === 'player') {
        if (e.options) {
          this.toDisplay.options.push(...e.options);

        } else {
          this.toDisplay.options.push(e);
        }
      }
    }

    this.clearFlags([hasNext]);

    return this.toDisplay;
  }

  getMessageLabel(label) {
    this.flags.add(label);

    this.index = this.story
      .map((v) => v.condition || '')
      .findIndex((v) => v.indexOf(label) >= 0);

    return this.getMessage();
  }

  resetTerminal() {
    this.index = 0;
  }

  parseLabel(label) {
    let str = label
      .split(' ')
      .map((v) => {
        if (v === this.currentLabel) return 'true';
        if (v === 'and') return '&&';
        if (v === 'or') return '||';
        if (v === ')') return ')';
        if (v === '(') return '(';
        if (v === 'not') return '!';
        if (this.flags.has(v)) return 'true';
        else return 'false';
      })
      .join('');

    return eval(str);
  }

  getFlags() {
    return Array.from(this.flags).join(',');
  }

  setFlags(flags) {
    flags.forEach((e) => {
      this.flags.add(e);
    });
  }

  clearFlags(flags) {
    flags.forEach((e) => {
      this.flags.delete(e);
    });
  }

  deleteAllFlags() {
    this.flags.clear();
  }

  setTerminal(n) {
    this.index = 0;
    this.story = StoriesJson[n];
    this.initflags();
  }

  setChoice(choice) {

    if (choice.set) {
      choice.set.split(' ').map((v) => {
        this.flags.add(v);
      });
    }
    if (choice.clear) {
      choice.set.split(' ').map((v) => {
        this.flags.delete(v);
      });
    }

    this.currentLabel = choice.next;
    this.index = this.story
      .map((v) => v.condition || '')
      .findIndex(
        (v, i) => v.indexOf(choice.next + ' ') >= 0 && i >= this.index
      );
    if (this.index < 0) {
      this.currentLabel = choice.next;
      this.index = this.story
        .map((v) => v.condition || '')
        .findIndex((v) => v.indexOf(choice.next + ' ') >= 0);
    }
  }

  gotoLabel(label) {
    this.flags.add(label);

    let index = this.story
      .map((v) => v.condition || '')
      .findIndex((v) => v.indexOf(label + ' ') >= 0 && this.parseLabel(v));
    if (index >= 0) {
      if (this.story[index].text)
        this.toDisplay.text.push(...this.story[index].text);
      if (this.story[index].options)
        this.toDisplay.options.push(...this.story[index].options);
      if (this.story[index].set)
        this.setFlags(this.story[index].set.split(' '));

      if (this.story[index].clear)
        this.story[index].clear.split(' ').map((v) => {
          this.flags.delete(v);
        });
      if (this.story[index].goto) this.gotoLabel(this.story[index].goto);
    }

    this.flags.delete(label);
  }

  postStart() {
    this.flags.delete('Booting');

    this.flags.delete('QueryMLA_START');
    //this.flags.delete('QueryMLA_ON');

    this.flags.delete('Milton1_1_Start');
    this.flags.delete('Milton1_2_Start');

    this.flags.delete('Milton2_1_Start');
    this.flags.delete('Milton2_2_Start');
    this.flags.delete('Milton2_3_Start');
    this.flags.delete('Milton2_4_Start');
    this.flags.delete('Milton2_5_Start');
    this.flags.delete('Milton2_6_Start');

    this.flags.delete('Milton3_1_Start');
    this.flags.delete('Milton3_2_Start');
    this.flags.delete('Milton3_3_Start');
    this.flags.delete('Milton3_4_Start');
    this.flags.delete('Milton3_5_Start');

    this.flags.delete('ChooseYourEpitaph');
    this.flags.delete('InTerminal_Ending_Gates');
    this.flags.delete('Milton3_6_Start');

    this.flags.delete('Tower1_START');
    this.flags.delete('Tower2_START');
  }

  initflags() {
    this.flags.add('Booting');

    this.flags.add('QueryMLA_START');
    this.flags.add('QueryMLA_ON');

    this.flags.add('Milton1_1_Start');
    this.flags.add('Milton1_2_Start');

    this.flags.add('Milton2_1_Start');
    this.flags.add('Milton2_2_Start');
    this.flags.add('Milton2_3_Start');
    this.flags.add('Milton2_4_Start');
    this.flags.add('Milton2_5_Start');
    this.flags.add('Milton2_6_Start');

    this.flags.add('Milton3_1_Start');
    this.flags.add('Milton3_2_Start');
    this.flags.add('Milton3_3_Start');
    this.flags.add('Milton3_4_Start');
    this.flags.add('Milton3_5_Start');

    this.flags.add('ChooseYourEpitaph');
    this.flags.add('InTerminal_Ending_Gates');
    this.flags.add('Milton3_6_Start');

    this.flags.add('Tower1_START');
    this.flags.add('Tower2_START');
  }

  constructor() {
    this.initflags();
  }
}
