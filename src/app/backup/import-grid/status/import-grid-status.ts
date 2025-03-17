import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: 'jbr-import-grid-status',
    templateUrl: './import-grid-status.html',
    styleUrls: ['./import-grid-status.css'],
    imports: [],
    standalone: true
})
export class ImportGridStatus {
    @Input() status: string;
    @Input() limit: number;
    @Output() refreshEvent: EventEmitter<void> = new EventEmitter();
    @Output() limitChangeEvent: EventEmitter<number> = new EventEmitter();


    refresh() {
        this.refreshEvent.emit();
    }

    increase(amount: number) {
        this.limitChangeEvent.emit(amount);
    }

    decrease(amount: number) {
        this.limitChangeEvent.emit(-1 * amount);
    }

    getLimit() {
        return this.limit;
    }
}
