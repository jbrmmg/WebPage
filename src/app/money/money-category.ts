export interface ICategory {
    id: string;
    name: string;
    sort: number;
    restricted: boolean;
    colour: string;
    group: string;
    systemUse: boolean;
    source: string;
}

export class Category implements ICategory {
    selected: boolean;

    constructor(public id: string,
                public name: string,
                public sort: number,
                public restricted: boolean,
                public colour: string,
                public group: string,
                public systemUse: boolean,
                public source: string ) {
    }
}
