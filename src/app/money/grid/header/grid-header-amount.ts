import {Component, TemplateRef} from "@angular/core";
import {FilterEvent, GridHeader} from "./grid-header";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {DatePipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ValueRange} from "../../range/valueRange";
import {HeaderType} from "./grid-header-type";

@Component({
    selector: 'jbr-grid-header-amount',
    templateUrl: './grid-header-amount.html',
    styleUrls: ['./grid-header-amount.css'],
    imports: [
        BsDatepickerModule,
        DatePipe,
        FormsModule
    ],
    standalone: true
})
export class GridHeaderAmount extends GridHeader {
    modalRef: BsModalRef;
    fromAmount: string;
    toAmount: string;

    constructor(private modalService: BsModalService ) {
        super();
    }

    fromChanged(event: any) {
        this.fromAmount = event.target.value;
    }

    toChanged(event: any) {
        this.toAmount = event.target.value;
    }

    exit() {
        this.modalRef.hide();
    }

    openModal(template: TemplateRef<any>) {
        if(this.filter != null && this.filter.valueRange != null) {
            this.fromAmount = this.filter.valueRange.minimum.toString();
            this.toAmount = this.filter.valueRange.maximum.toString();
        }

        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }

    clear() {
        this.modalRef.hide();

        if(this.filter != null) {
            this.filter.valueRange = null;
        }

        let event: FilterEvent = new FilterEvent();
        event.source = HeaderType.Credit;
        this.filterChanged.emit(event);
    }

    selectAmounts() {
        this.modalRef.hide();

        if(this.filter != null) {
            let min: number = parseInt(this.fromAmount);
            let max: number = parseInt(this.toAmount);

            if(min > max) {
                this.fromAmount = max.toString();
                this.toAmount = min.toString();

                min = parseInt(this.fromAmount);
                max = parseInt(this.toAmount);
            }

            this.filter.valueRange = new ValueRange(min,max);

            let event: FilterEvent = new FilterEvent();
            event.source = HeaderType.Credit;
            this.filterChanged.emit(event);
        }
    }
}
