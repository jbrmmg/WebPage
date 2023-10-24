import {Component, Input, OnInit} from "@angular/core";
import {IListRowLineInterface, ListRowLineType} from "../list-row-line/list-row-line-interface";

@Component({
    selector: 'jbr-money-row-date',
    templateUrl: './money-row-disp-date.html',
    styleUrls: ['./money-row-display.css']
})
export class MoneyRowDispDate implements OnInit {
    @Input() rowLine: IListRowLineInterface;

    ngOnInit(): void {
    }

    isHeader() : boolean {
        return this.rowLine.rowType == ListRowLineType.HEADER;
    }

    getDisplayText(): string {
        return "set me";
    }

    getClass(): string {
        return "set-me";
    }
}
