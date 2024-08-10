import {Component} from "@angular/core";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {GridData} from "./grid-data";

@Component({
    selector: 'jbr-grid-data-select',
    templateUrl: './grid-data-select.html',
    styleUrls: ['./grid-data-select.css'],
    imports: [
        NgIf,
        FormsModule
    ],
    standalone: true
})
export class GridDataSelect extends GridData {
    constructor() {
        super();
    }

    selected(): boolean {
        if (this.transaction.selected == null) {
            return false;
        }

        return this.transaction.selected;
    }

    select() {
        if(this.transaction.selected == null) {
            this.transaction.selected = false;
        }

        this.transaction.selected = !this.transaction.selected;
    }
}
