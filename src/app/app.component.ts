import { Component } from '@angular/core';

@Component({
  selector: 'pm-root',
  template: `
    <nav class='navbar navbar-expand navbar-light bg-light'>
      <img src="assets/images/logo.svg" height="30" width="30" />
      <a class='navbar-brand'>{{pageTitle}}</a>
      <ul class='nav nav-pills'>
        <li><a class='nav-link' [routerLink]="['/welcome']">Home</a></li>
        <li><a class='nav-link' [routerLink]="['/logs']">Logs</a></li>
        <li><a class='nav-link' [routerLink]="['/podcast']">Podcast</a></li>
        <li><a class='nav-link' [routerLink]="['/list']">List</a></li>
        <li><a class='nav-link' [routerLink]="['/house']">House</a></li>
        <li><a class='nav-link' [routerLink]="['/weight']">Weight</a></li>
      </ul>
    </nav>
    <router-outlet></router-outlet>
  `
})

export class AppComponent {
  pageTitle: string = 'JbrMmg';
}
