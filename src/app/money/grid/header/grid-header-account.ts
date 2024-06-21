import {Component, Input} from "@angular/core";

@Component({
    selector: 'jbr-grid-header-account',
    templateUrl: './grid-header-account.html',
    styleUrls: ['./grid-header-account.css'],
    standalone: true
})
export class GridHeaderAccount {
    @Input() header: string;
}
