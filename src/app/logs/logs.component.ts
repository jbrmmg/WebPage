import {Component, HostListener, ViewChild, OnInit} from "@angular/core";
import {BsDatepickerDirective} from "ngx-bootstrap";
import {ILogsType} from "./logs-type";
import {LogsService} from "./logs.service";
import {ILogsData} from "./logs-data";

@Component({
    templateUrl: './logs.component.html',
    styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
    radioLogType: string;
    minDate: Date;
    maxDate: Date;
    bsValue: Date;
    selectedType: string;
    errorMessage: string;

    types: ILogsType[];
    data: ILogsData[];

    @ViewChild(BsDatepickerDirective) datepicker: BsDatepickerDirective;

    constructor(private _logsService: LogsService) {
        this.minDate = new Date();
        this.maxDate = new Date();
        this.bsValue = new Date();
        this.minDate.setDate(this.minDate.getDate() - 5);
        this.maxDate.setDate(this.maxDate.getDate());
        this.selectedType = "";
    }

    updateLogData(): void {
        this._logsService.getLogsData(this.selectedType,this.bsValue).subscribe(
            data => {
                this.data = data;
            },
            error => this.errorMessage = <any>error
        );
    }

    ngOnInit(): void {
        this._logsService.getLogsTypes().subscribe(
            types => {
                this.types = types;
            },
            error => this.errorMessage = <any>error
        );
    }

    onClickType(type: string): void {
        this.selectedType = type;
        this.updateLogData();
    }

    onDateChange(newDate: Date): void {
        console.info("Date Change - " + newDate.toLocaleDateString("en-GB"));
        this.bsValue = newDate;

        if(this.selectedType != "")
            this.updateLogData();
    }

    @HostListener('window:scroll')
    onScrollEvent() {
        this.datepicker.hide();
    }
}
