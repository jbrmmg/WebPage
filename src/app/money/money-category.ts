export interface ICategory {
    id: string;
    name: string;
    sort: number;
    restricted: string,
    colour: string,
    group: string,
    systemUse: string,
    source: string
}

export class Category implements ICategory {
    selected: boolean;

    constructor(public id: string,
                public name: string,
                public sort: number,
                public restricted: string,
                public colour: string,
                public group: string,
                public systemUse: string,
                public source: string ) {
    }
}
