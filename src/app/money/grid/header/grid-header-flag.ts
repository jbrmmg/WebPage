import {Component, EventEmitter, Input, OnInit, TemplateRef, Type} from "@angular/core";
import {FlagType} from "./grid-header-flag-type";
import {FilterEvent, GridHeader} from "./grid-header";
import {HeaderType} from "./grid-header-type";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {PopupComponent} from "../../../standard/popup.component";
import {GridFilterFlag} from "../filters/grid-filter-flag";

@Component({
    selector: 'jbr-grid-header-flag',
    templateUrl: './grid-header-flag.html',
    styleUrls: ['./grid-header-flag.css'],
    imports: [
        PopupComponent
    ],
    standalone: true
})
export class GridHeaderFlag extends GridHeader implements OnInit {
    @Input() flagType: FlagType;
    modalRef: BsModalRef;
    content: Type<any>;
    inputs: Record<string,unknown>;
    okEvent: EventEmitter<void> = new EventEmitter();

    constructor(private modalService: BsModalService) {
        super();
    }

    ngOnInit(): void {
        this.content = GridFilterFlag;
        this.inputs = { filter: this.filter,
            okEvent: this.okEvent };
    }

    unset() : boolean {
        let flag: boolean;

        switch(this.flagType) {
            case FlagType.Locked:
                flag = this.filter.locked;
                break;
            case FlagType.Reconciled:
                flag = this.filter.fromReconciled;
                break;
            case FlagType.Predicted:
                flag = this.filter.predicted;
        }

        return flag == null;
    }

    flagFilter() : boolean {
        let flag: boolean;

        switch(this.flagType) {
            case FlagType.Locked:
                flag = this.filter.locked;
                break;
            case FlagType.Reconciled:
                flag = this.filter.fromReconciled;
                break;
            case FlagType.Predicted:
                flag = this.filter.predicted;
        }

        if(flag == null) {
            return false;
        }

        return flag;
    }

    setFilter(value: boolean) {
        switch(this.flagType) {
            case FlagType.Locked:
                this.filter.locked = value;
                break;
            case FlagType.Reconciled:
                this.filter.fromReconciled = value;
                break;
            case FlagType.Predicted:
                this.filter.predicted = value;
        }
    }

    getSourceFromFlagType() : HeaderType {
        switch (this.flagType) {
            case FlagType.Locked:
                return HeaderType.Locked;

            case FlagType.Predicted:
                return HeaderType.Predicted;

            case FlagType.Reconciled:
                return HeaderType.Reconciliation;
        }
    }

    changeValue() {
        // Change the value.
        if(this.unset()) {
            this.setFilter(true);
        } else if(this.flagFilter()) {
            this.setFilter(false);
        } else {
            this.setFilter(null);
        }

        // Generate the event.
        let event: FilterEvent = new FilterEvent();
        event.source = this.getSourceFromFlagType();
        this.filterChanged.emit(event);
    }

    onClear() {
        this.modalRef.hide();

        if(this.filter != null) {
            this.filter.fromReconciled = null;
            this.filter.predicted = null;
            this.filter.locked = null;
        }
    }

    onExit() {
        this.modalRef.hide();
    }

    onOK() {
        this.modalRef.hide();

        this.okEvent.emit();

        // Generate the event.
        let event: FilterEvent = new FilterEvent();
        event.source = this.getSourceFromFlagType();
        this.filterChanged.emit(event);
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }
}
