import {Component, TemplateRef} from "@angular/core";
import {FilterEvent, GridHeader} from "./grid-header";
import {DatePipe, NgForOf} from "@angular/common";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {DateRange} from "../../range/dateRange";
import {HeaderType} from "./grid-header-type";

@Component({
    selector: 'jbr-grid-header-date',
    templateUrl: './grid-header-date.html',
    styleUrls: ['./grid-header-date.css'],
    imports: [
        NgForOf,
        BsDatepickerModule,
        DatePipe
    ],
    standalone: true
})
export class GridHeaderDate extends GridHeader {
    modalRef: BsModalRef;
    toValue: Date = new Date();
    fromValue: Date = new Date();
    datePipe: DatePipe = new DatePipe('en-UK');

    constructor(private modalService: BsModalService ) {
        super();
    }

    onDateChangeFrom(newDate: Date): void {
        this.fromValue = newDate;
    }

    onDateChangeTo(newDate: Date): void {
        this.toValue = newDate;
    }

    exit() {
        this.modalRef.hide();
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

    openModal(template: TemplateRef<any>) {
        // If there is already a filter then display it.
        if(this.filter != null && this.filter.dateRange != null) {
            this.toValue = new Date(this.filter.dateRange.to + 'T00:00:00');
            this.fromValue = new Date(this.filter.dateRange.from + 'T00:00:00');
        }

        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }

    clear() {
        this.modalRef.hide();

        if(this.filter != null) {
            this.filter.dateRange = null;
        }

        let event: FilterEvent = new FilterEvent();
        event.source = HeaderType.Date;
        this.filterChanged.emit(event);
    }

    selectDates() {
        this.modalRef.hide();

        if(this.filter != null) {
            let fromValueString: string = this.datePipe.transform(this.fromValue,'yyyy-MM-dd');
            let toValueString: string = this.datePipe.transform(this.toValue,'yyyy-MM-dd');
            this.filter.dateRange = new DateRange(fromValueString,toValueString)
        }

        let event: FilterEvent = new FilterEvent();
        event.source = HeaderType.Date;
        this.filterChanged.emit(event);
    }
}
