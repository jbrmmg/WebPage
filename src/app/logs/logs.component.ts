import {Component, OnInit} from '@angular/core';
import {LogsService} from './logs.service';
import {ILogsData} from './logs-data';
import {LogsDate} from './logs-date';
import {LogsSelectedType} from './logs-selected-type';

@Component({
    templateUrl: './logs.component.html',
    styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
    errorMessage: string;
    availableDates: LogsDate[];
    types: LogsSelectedType[];
    data: ILogsData[];

    constructor(private readonly _logsService: LogsService) {
        this.types = [];
        this.availableDates = [];
        let today: Date;
        today = new Date();
        for (let i = 0; i < 5; i++) {
            this.availableDates.push(new LogsDate(today));
            today.setDate(today.getDate() - 1);
        }
        this.availableDates[0].selected = true;
    }

    ngOnInit(): void {
        this._logsService.getLogsTypes().subscribe(
            types => {
                types.forEach(element => this.types.push(new LogsSelectedType(element)));
                this.onClickType(this.types[0].type.id);
            },
            error => this.errorMessage = error
        );
    }

    onClickDate(selectedDate: Date): void {
        this.availableDates.forEach(element => {
            if (element.logDate === selectedDate) {
                console.log('here ' + element.logDate.toDateString() + ' ' + element.logDateString);
                element.selected = true;

                this.types.forEach(element2 => {
                   if (element2.selected) {
                       this.updateLogData(element2.type.id, element.logDate);
                   }
                });
            } else {
                element.selected = false;
            }
        });
    }

    onClickType(type: string): void {
        this.types.forEach(element => {
           if (element.type.id === type) {
               element.selected = true;

               this.availableDates.forEach(element2 => {
                  if (element2.selected) {
                      this.updateLogData(element.type.id, element2.logDate);
                  }
               });
           } else {
               element.selected = false;
           }
        });
    }

    updateLogData(type: string, selectedDate: Date): void {
        this._logsService.getLogsData(type, selectedDate).subscribe(
            data => {
                this.data = data;
            },
            error => this.errorMessage = error
        );
    }
}
