import { Component } from '@angular/core';
import {WelcomeService} from './welcome.service';

@Component({
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  textData1: string;
  textData2: string;

  constructor(private _welcomeService : WelcomeService) {

  }

  onClick() {
    // Send the data.
    this._welcomeService.SendData(this.textData1,this.textData2);

    // Reset
    this.textData1 = '';
    this.textData2 = '';
  }
}
