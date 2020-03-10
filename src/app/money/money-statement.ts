import {IAccount} from "./money-account";

export interface IStatement {
    account: IAccount;
    month: number;
    year: number;
    openBalance: number;
    locked: boolean;
}

export class Statement implements IStatement {
    selected: boolean;

    constructor(public account: IAccount,
                public month: number,
                public year: number,
                public openBalance: number,
                public locked: boolean ) {
    }
}
