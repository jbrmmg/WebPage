import {Component, EventEmitter, Input, OnInit} from "@angular/core";
import {NgClass, NgForOf} from "@angular/common";
import {StatementDate} from "../../statement/statementDate";
import {MoneyService} from "../../money.service";

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
    selector: 'jbr-filter-statement-date',
    templateUrl: './grid-filter-statement-date.html',
    styleUrls: ['./grid-filter-statement-date.css'],
    imports: [
        NgClass,
        NgForOf
    ],
    host: {'style': 'padding: 0;'},
    standalone: true
})
export class GridFilterStatementDate implements OnInit {
    errorMessage: string;
    years: YearOption[];
    months: MonthOption[][] = [];
    @Input() okEvent: EventEmitter<StatementDate>;

    constructor(private _moneyService: MoneyService) {
        let nextMonths: MonthOption[] = [];
        this.months.push(nextMonths);
        nextMonths.push(new MonthOption("Jan", 1), new MonthOption("Feb", 2), new MonthOption("Mar", 3), new MonthOption("Apr", 4), new MonthOption("May", 5), new MonthOption("Jun", 6));
        nextMonths = [];
        this.months.push(nextMonths);
        nextMonths.push(new MonthOption("Jul", 7), new MonthOption("Aug", 8), new MonthOption("Sep", 9), new MonthOption("Oct", 10), new MonthOption("Nov", 11), new MonthOption("Dec", 12));
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
            error: (response) => this.errorMessage = response,
            complete: () => {
                console.log("Statement Options Loaded")
            }
        });
    }

    clickYear(year: YearOption) {
        this.years.forEach(next => {
            next.selected = next.year == year.year;
        })
    }

    clickMonth(month: MonthOption) {
        let year: number = 0;
        this.years.forEach(next => {
            if(next.selected) {
                year = next.year;
            }
        })

        if(this.okEvent != null) {
            this.okEvent.emit(new StatementDate(year, month.month));
        }
    }

    blank() {
        if(this.okEvent != null) {
            this.okEvent.emit(new StatementDate(null, null));
        }
    }
}
