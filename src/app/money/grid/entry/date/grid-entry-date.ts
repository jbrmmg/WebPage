import {Component, EventEmitter, Input} from "@angular/core";
import {DatePipe, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {PopupComponent} from "../../../../standard/popup.component";

@Component({
    selector: 'jbr-entry-date',
    templateUrl: './grid-entry-date.html',
    styleUrls: ['./grid-entry-date.css'],
    imports: [
        DatePipe,
        NgIf,
        FormsModule,
        BsDatepickerModule,
        PopupComponent
    ],
    host: {'style': 'padding: 0;'},
    standalone: true
})
export class GridEntryDate {
    @Input() dateValue: Date;
    @Input() input: EventEmitter<Date>;

    initialise: boolean = false;

    onDateChange(newValue: Date) {
        if(this.initialise) {
            // Fire the event.
            if (this.input != null) {
                this.input.emit(newValue);
            }
        }
        this.initialise = true;
    }
}
