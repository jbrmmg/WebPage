export interface ITransaction {
    id: number;
    accountId: string;
    categoryId: string;
    date: string;
    amount: number;
    hasStatement: boolean;
    statementMonth: number;
    statementYear: number;
    statementLocked: boolean;
    description: string;
    oppositeTransactionId: number;
}

export class Transaction {
    date: string;
    amount: number;
    categoryId: string;
    accountId: string;
    description: string;
}
