import {Component, EventEmitter, Input, OnInit} from "@angular/core";
import {DatePipe} from "@angular/common";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {TransactionFilter} from "../../transaction/transactionFilter";
import {DateRange} from "../../range/dateRange";

@Component({
    selector: 'jbr-filter-date',
    templateUrl: './grid-filter-date.html',
    styleUrls: ['./grid-filter-date.css'],
    imports: [
        DatePipe,
        BsDatepickerModule
    ],
    host: {'style': 'padding: 0;'},
    standalone: true
})
export class GridFilterDate implements OnInit {
    @Input() filter: TransactionFilter;
    @Input() okEvent: EventEmitter<void>;
    toValue: Date = new Date();
    fromValue: Date = new Date();
    datePipe: DatePipe = new DatePipe('en-UK');

    ngOnInit(): void {
        // Set up the event handlers.
        if(this.okEvent != null) {
            this.okEvent.subscribe(() => {
                this.onOK();
            });
        }

        // Set up the range.
        if(this.filter != null && this.filter.valueRange != null) {
            this.toValue = new Date(this.filter.dateRange.to + 'T00:00:00');
            this.fromValue = new Date(this.filter.dateRange.from + 'T00:00:00');
        }
    }

    onDateChangeFrom(newDate: Date): void {
        this.fromValue = newDate;
    }

    onDateChangeTo(newDate: Date): void {
        this.toValue = newDate;
    }

    yearToDate() {
        let today = new Date();

        this.fromValue = new Date(today.getFullYear(),0,1);
        this.toValue = today;
    }

    last12Months(){
        let today = new Date();

        this.fromValue = new Date(today.getFullYear() - 1,today.getMonth(),today.getDate());
        this.toValue = today;
    }

    lastYear(){
        let today = new Date();

        this.fromValue = new Date(today.getFullYear() - 1,0,1);
        this.toValue = new Date(today.getFullYear() - 1,11,31);
    }

    monthToDate(){
        let today = new Date();

        this.fromValue = new Date(today.getFullYear(),today.getMonth(),1);
        this.toValue = today;
    }

    lastMonth(){
        let today = new Date();

        if(today.getMonth() == 0) {
            this.fromValue = new Date(today.getFullYear() - 1, 11, today.getDate());
        } else {
            this.fromValue = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        }
        this.toValue = today;
    }

    previousMonth(){
        let today = new Date();

        if(today.getMonth() == 0) {
            this.fromValue = new Date(today.getFullYear() - 1, 11, 1);
        } else {
            this.fromValue = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        }
        this.toValue = today;
    }

    onOK() {
        if(this.filter != null) {
            let fromValueString: string = this.datePipe.transform(this.fromValue, 'yyyy-MM-dd');
            let toValueString: string = this.datePipe.transform(this.toValue, 'yyyy-MM-dd');
            this.filter.dateRange = new DateRange(fromValueString, toValueString);
        }
    }
}
