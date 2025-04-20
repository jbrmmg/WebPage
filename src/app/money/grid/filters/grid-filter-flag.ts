import {Component, EventEmitter, Input, OnInit} from "@angular/core";
import {NgClass, NgForOf} from "@angular/common";
import {FlagType} from "../header/grid-header-flag-type";
import {TransactionFilter} from "../../transaction/transactionFilter";

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
    selector: 'jbr-filter-flag',
    templateUrl: './grid-filter-flag.html',
    styleUrls: ['./grid-filter-flag.css'],
    imports: [
        NgClass,
        NgForOf
    ],
    host: {'style': 'padding: 0;'},
    standalone: true
})
export class GridFilterFlag implements OnInit {
    flags: FlagFilterOption[][];
    @Input() filter: TransactionFilter;
    @Input() okEvent: EventEmitter<void>;

    constructor() {
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

    ngOnInit(): void {
        // Set up the event handlers.
        if(this.okEvent != null) {
            this.okEvent.subscribe(() => {
                this.onOK();
            });
        }

        // Transfer the filter value to the display.
        if(this.filter != null) {
            this.flags.forEach(row => {
                let flagValue: boolean;

                if (row[0].id != null) {
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

    onOK() {
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
}
