/*
* Equivalent of StatementDateDTO
*/

export interface IStatementDate {
    year: number;
    month: number;
}

export class StatementDate {
    constructor(public year: number,
                public month: number) {
    }
}
