export interface IAction {
    id: number;
    fileId: number;
    fileName: string;
    fileSize: number;
    fileDate: Date;
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
                public fileSize: number,
                public fileDate: Date,
                public isImage: boolean,
                public isVideo: boolean,
                public action: string,
                public parameter: string,
                public confirmed: boolean ) {
    }
}
