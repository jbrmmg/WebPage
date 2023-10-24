import {Component, Input, OnInit} from "@angular/core";
import {IListRowLineInterface} from "../list-row-line/list-row-line-interface";

@Component({
    selector: 'jbr-money-row',
    templateUrl: './money-row-display.html',
    styleUrls: ['./money-row-display.css']
})
export class MoneyRowDisplay implements OnInit {
    @Input() rowLine: IListRowLineInterface;

    ngOnInit(): void {
    }
}
