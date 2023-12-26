export interface ILabel {
    id : number;
    name : string;
}

export class Label implements ILabel {
    selected: boolean;
    constructor(public id: number,
                public name: string) {
    }
}

export class FileLabel {
    fileId: number;
    labels: number[];
}
