import {Component, OnInit, TemplateRef} from "@angular/core";
import {FilterEvent, GridHeader} from "./grid-header";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {MoneyService} from "../../money.service";
import {StatementDate} from "../../statement/statementDate"
import {HeaderType} from "./grid-header-type";

class MonthOption {
    display: string;
    month: number;
    selected: boolean;

    constructor(display: string, month: number) {
        this.display = display;
        this.month = month;
        this.selected = false;
    }
}

class YearOption {
    display: string;
    year: number;
    selected: boolean;

    constructor(year: number) {
        this.display = year.toString();
        this.year = year;
        this.selected = false;
    }
}

@Component({
    selector: 'jbr-grid-header-statement-date',
    templateUrl: './grid-header-statement-date.html',
    styleUrls: ['./grid-header-statement-date.css'],
    imports: [
        NgForOf,
        NgIf,
        BsDatepickerModule,
        NgClass
    ],
    standalone: true
})
export class GridHeaderStatementDate extends GridHeader implements OnInit {
    modalRef: BsModalRef;
    errorMessage: string;
    years: YearOption[];
    months: MonthOption[][] = [];

    constructor(private modalService: BsModalService,
                private _moneyService: MoneyService) {
        super();

        let nextMonths: MonthOption[] = [];
        this.months.push(nextMonths);
        nextMonths.push(new MonthOption("Jan", 1));
        nextMonths.push(new MonthOption("Feb", 2));
        nextMonths.push(new MonthOption("Mar", 3));
        nextMonths.push(new MonthOption("Apr", 4));
        nextMonths.push(new MonthOption("May", 5));
        nextMonths.push(new MonthOption("Jun", 6));
        nextMonths = [];
        this.months.push(nextMonths);
        nextMonths.push(new MonthOption("Jul", 7));
        nextMonths.push(new MonthOption("Aug", 8));
        nextMonths.push(new MonthOption("Sep", 9));
        nextMonths.push(new MonthOption("Oct", 10));
        nextMonths.push(new MonthOption("Nov", 11));
        nextMonths.push(new MonthOption("Dec", 12));
    }

    ngOnInit(): void {
        this._moneyService.getStatements().subscribe({
            next: (statements) => {
                this.years = [];

                statements.forEach(value => {
                    // Is this already in the list?
                    let add: boolean = true;
                    this.years.forEach(year => {
                        if(value.year == year.year) {
                            add = false;
                            return;
                        }
                    })

                    // Add if required.
                    if(add) {
                        this.years.push(new YearOption(value.year));
                    }}
                );

                // Sort
                this.years.sort((lhs, rhs) => {
                    if(lhs == rhs)
                        return 0;

                    if(lhs > rhs)
                        return 1;

                    return -1;
                })
            },
            error: (response) => this.errorMessage = <any> response,
            complete: () => {
                console.log("Category Options Loaded")
            }
        });
    }

    clickYear(year: YearOption) {
        this.years.forEach(next => {
            next.selected = next.year == year.year;
        })
    }

    clickMonth(month: MonthOption) {
        this.modalRef.hide();

        let year: number = 0;
        this.years.forEach(next => {
            if(next.selected) {
                year = next.year;
            }
        })

        // Set the filter and then exit.
        if(this.filter != null) {
            this.filter.statementDate = new StatementDate(year,month.month);
        }

        let event: FilterEvent = new FilterEvent();
        event.source = HeaderType.StatementDate;
        this.filterChanged.emit(event);
    }

    blank() {
        this.modalRef.hide();

        if(this.filter != null) {
            this.filter.statementDate = new StatementDate(null,null);
        }

        let event: FilterEvent = new FilterEvent();
        event.source = HeaderType.StatementDate;
        this.filterChanged.emit(event);
    }

    clear() {
        this.modalRef.hide();

        if(this.filter != null) {
            this.filter.statementDate = null;
        }

        let event: FilterEvent = new FilterEvent();
        event.source = HeaderType.StatementDate;
        this.filterChanged.emit(event);
    }

    exit() {
        this.modalRef.hide();
    }

    selectStatement() {
        this.modalRef.hide()

        // If there is a selection displayed then select it.
        let year: number = 0;
        this.years.forEach(next => {
            if(next.selected) {
                year = next.year;
            }
        })

        let month: number =  0;
        this.months.forEach(row => {
            row.forEach(col => {
                if(col.selected) {
                    month = col.month;
                }
            })
        })

        // Set the filter and then exit.
        if(this.filter != null) {
            if(year != 0 && month != 0) {
                this.filter.statementDate = new StatementDate(year, month);
            } else {
                this.filter.statementDate = null;
            }
        }

        let event: FilterEvent = new FilterEvent();
        event.source = HeaderType.StatementDate;
        this.filterChanged.emit(event);
    }

    openModal(template: TemplateRef<any>) {
        // If the filter has a value, then highlight it.
        if(this.filter != null && this.filter.statementDate != null) {
            this.years.forEach(year => {
                year.selected = year.year == this.filter.statementDate.year;
            })

            this.months.forEach(row => {
                row.forEach(col => {
                    col.selected = col.month == this.filter.statementDate.month;
                })
            })
        } else {
            this.years.forEach(year => {
                year.selected = false;
            })

            this.months.forEach(row => {
                row.forEach(col => {
                    col.selected = false;
                })
            })
        }

        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }
}
