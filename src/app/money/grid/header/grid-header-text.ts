import {Component} from "@angular/core";
import {FilterEvent, GridHeader} from "./grid-header";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HeaderType} from "./grid-header-type";

@Component({
    selector: 'jbr-grid-header-text',
    templateUrl: './grid-header-text.html',
    styleUrls: ['./grid-header-text.css'],
    imports: [
        ReactiveFormsModule,
        FormsModule
    ],
    standalone: true
})
export class GridHeaderText extends GridHeader {
    description: string;

    valueUpdated() {
        if(this.description == null || this.description.length == 0) {
            this.filter.description = null;

            let event: FilterEvent = new FilterEvent();
            event.source = HeaderType.Description;
            this.filterChanged.emit(event);
        }
    }

    changeValue() {
        console.log(this.description);

        this.filter.description = this.description;

        let event: FilterEvent = new FilterEvent();
        event.source = HeaderType.Description;
        this.filterChanged.emit(event);
    }
}
