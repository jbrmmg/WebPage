import {Component} from "@angular/core";
import {DatePipe} from "@angular/common";
import {GridData} from "./grid-data";

@Component({
    selector: 'jbr-grid-data-statement-date',
    templateUrl: './grid-data-statement-date.html',
    styleUrls: ['./grid-data-statement-date.css'],
    imports: [
        DatePipe
    ],
    standalone: true
})
export class GridDataStatementDate extends GridData {
    display() : string {
        if(this.transaction.statement) {
            return String(this.transaction.statement.year) + "-" + String(this.transaction.statement.month);
        }

        return "";
    }
}
