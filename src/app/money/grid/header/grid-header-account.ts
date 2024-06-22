import {Component, Input} from "@angular/core";
import {FilterAccount} from "../filter/filter-account";

@Component({
    selector: 'jbr-grid-header-account',
    templateUrl: './grid-header-account.html',
    styleUrls: ['./grid-header-account.css'],
    imports: [
        FilterAccount
    ],
    standalone: true
})
export class GridHeaderAccount {
    @Input() header: string;
}
