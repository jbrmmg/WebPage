export interface IAction {
    id: number;
    fileId: number;
    fileName: string;
    image: boolean;
    video: boolean;
    action: string;
    parameter: string;
}

export class Action implements IAction {
    constructor(public id: number,
                public fileId: number,
                public fileName: string,
                public image: boolean,
                public video: boolean,
                public action: string,
                public parameter: string ) {
    }
}
