import {IAccount} from './money-jbaccount';

/*
 * Equivalent of StatementIdDTO
 */

export interface IStatementId {
    accountId: string;
    month: number;
    year: number;
}

/*
 * Equivalent of StatementDTO
 */

export interface IStatement {
    accountId: string;
    month: number;
    year: number;
    openBalance: number;
    locked: boolean;
}

export class Statement implements IStatement {
    selected: boolean;

    constructor(public accountId: string,
                public month: number,
                public year: number,
                public openBalance: number,
                public locked: boolean ) {
    }
}
