import {IListRowLineInterface, ListRowLineType} from "./list-row-line-interface";
import {ListRowLineTransaction} from "./list-row-line-transaction";
import {ITransaction, TransactionSummary} from "../money-transaction";
import {ListRowLineReconcile} from "./list-row-line-reconcile";
import {ListRowLineTotalBfwd} from "./list-row-line-total-bfwd";
import {ListRowLineTotalCfwd} from "./list-row-line-total-cfwd";
import {ListRowLineTotalCredits} from "./list-row-line-total-credits";
import {ListRowLineTotalDebits} from "./list-row-line-total-debits";
import {ListRowLineRegular} from "./list-row-line-regular";
import {ListRowLineReconcileTop} from "./list-row-line-reconcile-top";
import {IMatch} from "../money-match";
import {IRegular} from "../money-regular";


export class ListRowLineFactory {
    static createRowLineTransaction(transaction: ITransaction,
                                    summary: TransactionSummary) : IListRowLineInterface {
        return new ListRowLineTransaction(transaction,summary);
    }

    static createRowLineReconcile(reconcile: IMatch) : IListRowLineInterface {
        return new ListRowLineReconcile(reconcile);
    }

    static createRowLineReconcileTop() : IListRowLineInterface {
        return new ListRowLineReconcileTop();
    }

    static createRowLineRegular(regular: IRegular) : IListRowLineInterface {
        return new ListRowLineRegular(regular);
    }

    static createRowLineTotalBfwd(summary: TransactionSummary) : IListRowLineInterface {
        return new ListRowLineTotalBfwd(summary);
    }

    static createRowLineTotalCfwd(summary: TransactionSummary) : IListRowLineInterface {
        return new ListRowLineTotalCfwd(summary);
    }

    static createRowLineCredits(summary: TransactionSummary) : IListRowLineInterface {
        return new ListRowLineTotalCredits(summary);
    }

    static createRowLineDebits(summary: TransactionSummary) : IListRowLineInterface {
        return new ListRowLineTotalDebits(summary);
    }

    static getMonthName(month: number): string {
        switch(month) {
            case 0: {
                return "Jan";
            }
            case 1: {
                return "Feb";
            }
            case 2: {
                return "Mar";
            }
            case 3: {
                return "Apr";
            }
            case 4: {
                return "May";
            }
            case 5: {
                return "Jun";
            }
            case 6: {
                return "Jul";
            }
            case 7: {
                return "Aug";
            }
            case 8: {
                return "Sep";
            }
            case 9: {
                return "Oct";
            }
            case 10: {
                return "Nov";
            }
            case 11: {
                return "Dec";
            }
            default: {
                return "Xxx";
            }
        }

        return "Xxx";
    }
}
