import {Component, Input, TemplateRef} from "@angular/core";
import {FlagType} from "./grid-header-flag-type";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FilterEvent, GridHeader} from "./grid-header";
import {HeaderType} from "./grid-header-type";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

class FlagFilterOption {
    id: FlagType;
    display: string;
    flagValue: boolean;
    selected: boolean;
    otherRow: FlagFilterOption[];
    otherColumn: FlagFilterOption[]

    constructor(id: FlagType, display: string, flagValue: boolean) {
        this.id = id;
        this.display = display;
        this.flagValue = flagValue;
        this.selected = false;
        this.otherRow = [];
        this.otherColumn = [];
    }
}

@Component({
    selector: 'jbr-grid-header-flag',
    templateUrl: './grid-header-flag.html',
    styleUrls: ['./grid-header-flag.css'],
    imports: [
        NgIf,
        NgForOf,
        NgClass
    ],
    standalone: true
})
export class GridHeaderFlag extends GridHeader {
    @Input() flagType: FlagType;
    modalRef: BsModalRef;
    flags: FlagFilterOption[][];

    constructor(private modalService: BsModalService ) {
        super();

        this.flags = []
        this.addRow(null,"All");
        this.addRow(FlagType.Locked,"Locked");
        this.addRow(FlagType.Predicted,"Predicted");
        this.addRow(FlagType.Reconciled,"Reconciled");

        this.flags[0][0].otherColumn.push(this.flags[1][0]);
        this.flags[0][0].otherColumn.push(this.flags[2][0]);
        this.flags[0][0].otherColumn.push(this.flags[3][0]);

        this.flags[0][1].otherColumn.push(this.flags[1][1]);
        this.flags[0][1].otherColumn.push(this.flags[2][1]);
        this.flags[0][1].otherColumn.push(this.flags[3][1]);

        this.flags[0][2].otherColumn.push(this.flags[1][2]);
        this.flags[0][2].otherColumn.push(this.flags[2][2]);
        this.flags[0][2].otherColumn.push(this.flags[3][2]);
    }

    addRow(type: FlagType, display: string) {
        let row: FlagFilterOption[] = [];
        row.push(new FlagFilterOption(type, display + " True", true));
        row.push(new FlagFilterOption(type, display + " False", false));
        row.push(new FlagFilterOption(type, display + " Unset", null));
        row[0].otherRow.push(row[1]);
        row[0].otherRow.push(row[2]);
        row[1].otherRow.push(row[0]);
        row[1].otherRow.push(row[2]);
        row[2].otherRow.push(row[0]);
        row[2].otherRow.push(row[1]);
        this.flags.push(row);
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

        return flag == true;
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
        } else if(this.flagFilter() == true) {
            this.setFilter(false);
        } else {
            this.setFilter(null);
        }

        // Generate the event.
        let event: FilterEvent = new FilterEvent();
        event.source = this.getSourceFromFlagType();
        this.filterChanged.emit(event);
    }

    exit() {
        this.modalRef.hide();
    }

    setAllFlags() {
        // Should the all flags be set?
        this.flags[0].forEach(col => {
            col.selected = false;
            let allTrue: boolean = true;
            col.otherColumn.forEach(other => {
                if(!other.selected) {
                    allTrue = false;
                }
            })

            if(allTrue) {
                col.selected = true;
            }
        });
    }

    clickFlag(item: FlagFilterOption) {
        if(item.id == null) {
            // Set all the items in the same column.
            item.selected = true;
            item.otherColumn.forEach(col => {
                col.selected = true;
                col.otherRow.forEach(row => {
                    row.selected = false;
                })
            })
            item.otherRow.forEach(row => {
                row.selected = false;
            })
        } else {
            item.selected = true;
            item.otherRow.forEach(row => {
                row.selected = false;
            })

            // Check the 'all' buttons.
            this.setAllFlags();
        }
    }

    openModal(template: TemplateRef<any>) {
        // Set the options
        if(this.filter != null) {
            this.flags.forEach(row => {
                let flagValue: boolean;

                if(row[0].id != null) {
                    switch (row[0].id) {
                        case FlagType.Locked:
                            flagValue = this.filter.locked;
                            break;
                        case FlagType.Predicted:
                            flagValue = this.filter.predicted;
                            break;
                        case FlagType.Reconciled:
                            flagValue = this.filter.fromReconciled;
                            break;
                    }

                    row.forEach(col => {
                        col.selected = false;

                        if (flagValue == null && col.flagValue == null) {
                            col.selected = true;
                        } else if (flagValue == col.flagValue) {
                            col.selected = true;
                        }
                    })
                }
            })

            this.setAllFlags();
        }

        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }

    selectFlags() {
        this.modalRef.hide();

        // Set the filter.
        if(this.filter != null) {
            this.flags.forEach(row => {
                if(row[0].id != null) {
                    row.forEach(col => {
                        if(col.selected) {
                            switch(col.id) {
                                case FlagType.Locked:
                                    this.filter.locked = col.flagValue;
                                    break;
                                case FlagType.Predicted:
                                    this.filter.predicted = col.flagValue;
                                    break;
                                case FlagType.Reconciled:
                                    this.filter.fromReconciled = col.flagValue;
                                    break;
                            }
                        }
                    })
                }
            })
        }

        // Generate the event.
        let event: FilterEvent = new FilterEvent();
        event.source = HeaderType.AllFlag;
        this.filterChanged.emit(event);
    }
}
