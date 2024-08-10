import {Component, OnInit} from "@angular/core";
import {GridData} from "./grid-data";

class ActionOption {
    text: string;
}

@Component({
    selector: 'jbr-grid-data-actions',
    templateUrl: './grid-data-actions.html',
    styleUrls: ['./grid-data-actions.css'],
    standalone: true
})
export class GridDataActions extends GridData implements OnInit {
    actions: ActionOption[] = [];

    ngOnInit(): void {
    }
}
