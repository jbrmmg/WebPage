export interface IAccount {
    id: string;
    name: string;
    imagePrefix: string;
    colour: string;
}

export class JbAccount implements IAccount {
    selected: boolean;

    constructor(public id: string,
                public name: string,
                public imagePrefix: string,
                public colour: string ) {
    }
}
