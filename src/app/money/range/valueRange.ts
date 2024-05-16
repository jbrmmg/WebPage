/*
* Equivalent of ValueRangeDTO
*/

export interface IValueRange {
    minimum: number;
    maximum: number;
}

export class ValueRange {
    constructor(public minimum: number,
                public maximum: number) {
    }
}
