export interface IAction {
    id: number;
    fileId: number;
    fileName: string;
    size: number;
    date: Date;
    isImage: boolean;
    isVideo: boolean;
    action: string;
    parameter: string;
    confirmed: boolean
}

export class Action implements IAction {
    constructor(public id: number,
                public fileId: number,
                public fileName: string,
                public size: number,
                public date: Date,
                public isImage: boolean,
                public isVideo: boolean,
                public action: string,
                public parameter: string,
                public confirmed: boolean ) {
    }
}
