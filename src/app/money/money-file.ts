import {IAccount} from "./money-jbaccount";

export interface IFile {
    filename: string;
    size: number;
    error: string;
    transactionCount: number;
    creditSum: number;
    debitSum: number;
    earliestTransaction: string;
    latestTransaction: string;
    account: IAccount;
    lastModified: string;
}
