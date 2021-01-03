import {IListRowLineInterface, ListRowLineType} from './list-row-line-interface';
import {ICategory} from '../money-category';
import {IStatement} from '../money-statement';
import {MoneyService} from '../money.service';
import {ListRowSummary} from './list-row-summary';
import {ListRowLine} from './list-row-line';

export class ListRowLineTotalCfwd extends ListRowLine  implements IListRowLineInterface {
    private summary: ListRowSummary;
    private readonly selectedStatement: IStatement;
    private readonly moneyService: MoneyService;

    constructor(moneyService: MoneyService,
                summary: ListRowSummary,
                statement: IStatement ) {
        super();

        this.rowType = ListRowLineType.TOTAL_CARRIED_FORWARD;
        this.isTotalRow = true;
        this.description = 'Carried Forward';

        if (statement != null) {
            this.hasButtonThree = true;

            if (statement.locked) {
                this.enableButtonThree = false;
                this.classButtonThree = 'fa fa-lock';
            } else {
                this.enableButtonThree = true;
                this.classButtonThree = 'fa fa-unlock';
            }
        } else {
            this.hasButtonThree = false;
            this.enableButtonThree = false;
            this.classButtonThree = '';
        }

        this.selected = false;
        this.summary = summary;
        this.selectedStatement = statement;
        this.moneyService = moneyService;
    }

    select() {
    }

    clickButtonOne() {
    }

    clickButtonTwo() {
    }

    completeEdit(id: number, selectedCategory: ICategory, description: string, amount: number) {
    }

    clickButtonThree() {
        // If the statement is present and not locked, request the lock.
        if (this.selectedStatement == null || this.selectedStatement.locked) {
            return;
        }

        this.moneyService.lockStatement(this.selectedStatement);
    }

    categorySelected(selectedCategory: ICategory) {
    }

    getAmount(): number {
        this.amount = this.summary.carriedForward;
        this.amountDisplay = this.amount.toFixed(2);
        return this.amount;
    }
}
