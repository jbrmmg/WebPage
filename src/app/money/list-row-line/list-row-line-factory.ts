import {IListRowLineInterface} from './list-row-line-interface';
import {ListRowLineTransaction} from './list-row-line-transaction';
import {ListRowLineReconcile} from './list-row-line-reconcile';
import {ListRowLineTotalBfwd} from './list-row-line-total-bfwd';
import {ListRowLineTotalCfwd} from './list-row-line-total-cfwd';
import {ListRowLineTotalCredits} from './list-row-line-total-credits';
import {ListRowLineTotalDebits} from './list-row-line-total-debits';
import {ListRowLineRegular} from './list-row-line-regular';
import {ListRowLineReconcileTop} from './list-row-line-reconcile-top';
import {IMatch} from '../money-match';
import {IRegular} from '../money-regular';
import {MoneyService} from '../money.service';
import {IStatement} from '../money-statement';
import {ITransaction, ListRowSummary} from './list-row-summary';


export class ListRowLineFactory {
    static createRowLineTransaction(moneyService: MoneyService,
                                    transaction: ITransaction,
                                    summary: ListRowSummary,
                                    editSelect: (transaction: ITransaction, clear: boolean) => void ): IListRowLineInterface {
        return new ListRowLineTransaction(moneyService, transaction, summary, editSelect);
    }

    static createRowLineReconcile(moneyService: MoneyService, reconcile: IMatch): IListRowLineInterface {
        return new ListRowLineReconcile(moneyService, reconcile);
    }

    static createRowLineReconcileTop(moneyService: MoneyService, updateCategory: () => void): IListRowLineInterface {
        return new ListRowLineReconcileTop(moneyService, updateCategory);
    }

    static createRowLineRegular(regular: IRegular): IListRowLineInterface {
        return new ListRowLineRegular(regular);
    }

    static createRowLineTotalBfwd(summary: ListRowSummary): IListRowLineInterface {
        return new ListRowLineTotalBfwd(summary);
    }

    static createRowLineTotalCfwd(moneyService: MoneyService, summary: ListRowSummary, statement: IStatement): IListRowLineInterface {
        return new ListRowLineTotalCfwd(moneyService, summary, statement);
    }

    static createRowLineCredits(summary: ListRowSummary): IListRowLineInterface {
        return new ListRowLineTotalCredits(summary);
    }

    static createRowLineDebits(summary: ListRowSummary): IListRowLineInterface {
        return new ListRowLineTotalDebits(summary);
    }
}
