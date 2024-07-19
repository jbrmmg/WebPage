import {Component, Input, OnInit, TemplateRef} from "@angular/core";
import {GridHeader} from "./grid-header";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {NgForOf, NgIf} from "@angular/common";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {MoneyService} from "../../money.service";
import {Statement} from "../../statement/statement";

class StatementFilterOption {
    display: string;
    year: number;
    month: number;
    selected: boolean;
}

@Component({
    selector: 'jbr-grid-header-statement-date',
    templateUrl: './grid-header-statement-date.html',
    styleUrls: ['./grid-header-statement-date.css'],
    imports: [
        NgForOf,
        NgIf,
        BsDatepickerModule
    ],
    standalone: true
})
export class GridHeaderStatementDate extends GridHeader implements OnInit {
    modalRef: BsModalRef;
    errorMessage: string;
    columns: number = 6;
    statements: StatementFilterOption[][];
    blankStatementDisplay: string = "(none)";

    constructor(private modalService: BsModalService,
                private _moneyService: MoneyService) {
        super();
    }

    getDateFormat(statement: Statement): string {
        if(statement.month < 10) {
            return statement.year + "-0" + statement.month;
        }

        return statement.year + "-" + statement.month;
    }

    ngOnInit(): void {
        this._moneyService.getStatements().subscribe({
            next: (statements) => {
                this.statements = [];

                let tempList: StatementFilterOption[] = [];

                let blank: StatementFilterOption = new StatementFilterOption();
                blank.year = null;
                blank.month = null;
                blank.selected = false;
                blank.display = this.blankStatementDisplay;
                tempList.push(blank);

                statements.forEach(value => {
                    let next: StatementFilterOption = new StatementFilterOption();
                    next.selected = false;
                    next.month = value.month;
                    next.year = value.year;
                    next.display = this.getDateFormat(value);

                    // Is this already in the list?
                    let add: boolean = true;
                    tempList.forEach(value =>{
                        if(value.month == next.month && value.year == next.year) {
                            add = false;
                            return;
                        }
                    })

                    // Add if required.
                    if(add) {
                        tempList.push(next);
                    }}
                );

                // Sort
                tempList.sort((lhs, rhs) => {
                    if(lhs.display == this.blankStatementDisplay) {
                        return 1;
                    }

                    if(rhs.display == this.blankStatementDisplay) {
                        return -1;
                    }

                    return lhs.display.localeCompare(rhs.display);
                })

                // Copy the list into the 2d array.
                let nextRow: StatementFilterOption[] = [];
                tempList.forEach(value => {
                    nextRow.push(value);

                    if(nextRow.length == this.columns) {
                        this.statements.push(nextRow);
                        nextRow = [];
                    }
                })
                if(nextRow.length > 0) {
                    this.statements.push(nextRow);
                }
            },
            error: (response) => this.errorMessage = <any> response,
            complete: () => {
                console.log("Category Options Loaded")
            }
        });
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }
}
