/*
* Equivalent of DateRangeDTO
*/

export interface IDateRange {
    from: string;
    to: string;
}

export class DateRange {
    constructor(public from: string,
                public to: string) {
    }
}
