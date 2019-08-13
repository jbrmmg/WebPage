export interface IStatement {
    account: string;
    month: number;
    year: number;
    openBalance: number;
    locked: boolean;
    notLocked: boolean;
    yearMonthId: string;
}

export class Statement implements IStatement {
    selected: boolean;

    constructor(public account: string,
                public month: number,
                public year: number,
                public openBalance: number,
                public locked: boolean,
                public notLocked: boolean,
                public yearMonthId: string ) {
    }
}
