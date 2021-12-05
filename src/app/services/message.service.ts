import { Injectable } from '@angular/core';
import StoriesJson from '../../assets/json/stories.js';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  index: number = 0;
  story; // = StoryJson;
  flags = new Set();
  currentLabel: string = '';
  showTerminals: boolean = false;
  toDisplay

  getMessage() {
    /****************   testing somrthing remove later     ************ */
/*
    this.story.forEach((e, i) => {
      if (this.parseLabel(e.condition))
        console.log('this story part is true', i, e);
    });
    */
    /**************************************************************** */

    console.log("getMessage called");
 
    this.toDisplay = {}
    this.toDisplay.text = [];
    this.toDisplay.options = [];


    console.log(this.index, this.flags);
    for (let i = 0; i < this.story.length; i++) {
      const e = this.story[i];
      if (this.parseLabel(e.condition) && e.display === 'terminal') {
        if (e.text) this.toDisplay.text.push(...e.text);
        if (e.options) this.toDisplay.options.push(...e.options);
        if (e.set) this.setFlags(e.set.split(' '));

        if (e.goto) {
          this.toDisplay.goto = e.goto;
          this.gotoLabel(e.goto)
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
        //obj.text.push(e.text)
        this.toDisplay.options.push(e);
      }
    }

    console.log('in getmessage ', this.toDisplay);

    return this.toDisplay;
  }

  getMessageLabel(label) {
    this.flags.add(label);

    this.index = this.story
      .map((v) => v.condition || '')
      .findIndex((v) => v.indexOf(label) >= 0);

    console.log('goto called', label, this.index);

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
    // console.log(str);

    return eval(str);
  }

  getFlags() {
    return Array.from(this.flags).join(',');
  }

  setFlags(flags) {
    flags.forEach((e) => {
      this.flags.add(e);
    });
    console.log('on setFlags message service', this.flags);
  }

  clearflags() {
    this.flags.clear();
    this.initflags();
  }

  setTerminal(n) {
    this.index = 0;
    //console.log(this.story);
    this.story = StoriesJson[n];
    this.initflags();
  }

  setChoice(choice) {
    console.log('choice : ', choice);

    if (choice.set) {
      // add for each
      choice.set.split(' ').map((v) => {
        this.flags.add(v);
      });
      //this.flags.add(choice.set.split(" "));
      console.log(this.flags);
    }
    if (choice.clear) {
      // add for each
      //this.flags.delete(choice.clear.split(" "));
      choice.set.split(' ').map((v) => {
        this.flags.add(v);
      });
      console.log(this.flags);
    }
    /* TODO this may be a big problem

    this.currentLabel = choice.next;
    this.index = this.story
      .map((v) => v.condition || '')
      .findIndex((v) => v.indexOf(choice.next + ' ') >= 0);
    console.log(this.index, this.story[this.index]);
    */

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
    console.log(this.index, this.story[this.index]);
  }

  gotoLabel(label) {

    this.flags.add(label);
    
    let index = this.story
      .map((v) => v.condition || '')
      .findIndex((v) => v.indexOf(label + ' ') >= 0 && this.parseLabel(v));
      if (index>=0) {
        console.log("goto in get message v2 index :",index,"goto",label,this.flags);
        if (this.story[index].text) this.toDisplay.text.push(...this.story[index].text);
        if (this.story[index].options) this.toDisplay.options.push(...this.story[index].options);
        if (this.story[index].set) this.setFlags(this.story[index].set.split(' '));
        if (this.story[index].clear)
        this.story[index].clear.split(' ').map((v) => {
          this.flags.delete(v);
        });
        if (this.story[index].goto) 
          this.gotoLabel(this.story[index].goto)
      }

      this.flags.delete(label);

    console.log('on goto', this.toDisplay);
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
  }

  constructor() {
    this.initflags();
  }
}
