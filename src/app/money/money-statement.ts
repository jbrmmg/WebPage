import {IAccount} from "./money-account";

export interface IStatementId {
    account: IAccount;
    month: number;
    year: number;
}

export interface IStatement {
    id: IStatementId;
    openBalance: number;
    locked: boolean;
}

export class Statement implements IStatement {
    selected: boolean;

    constructor(public id: IStatementId,
                public openBalance: number,
                public locked: boolean ) {
    }
}
