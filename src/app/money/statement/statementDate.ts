/*
* Equivalent of StatementDateDTO
*/

export class StatementDate {
    none: boolean;

    constructor(public year: number,
                public month: number) {
        this.none = year == null && month == null;
    }
}
