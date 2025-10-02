import {Component, OnInit} from '@angular/core';
import {WelcomeService} from './welcome.service';

@Component({
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  textData1: string;
  textData2: string;
  version: string;

  constructor(private readonly _welcomeService: WelcomeService) {
  }

  ngOnInit() {
      this._welcomeService.getVersion().subscribe(data => {
          this.version = data.version;
      });
  }

  onClick() {
    // Send the data.
    this._welcomeService.SendData(this.textData1, this.textData2);

    // Reset
    this.textData1 = '';
    this.textData2 = '';
  }
}
