import {ITransactionReport} from './transactionReport';

export interface ITransactionPage {
    totalCount: number;
    pageNumber: number;
    maxPageSize: number;
    transactions: ITransactionReport[];
}
