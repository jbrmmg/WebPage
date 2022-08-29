export interface ILog {
    date: Date;
    type: string;
    message: string;
}

export class Log implements ILog {
    constructor(public date: Date,
                public type: string,
                public message: string ) {
    }
}
