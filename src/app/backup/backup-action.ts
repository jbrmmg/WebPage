import {FileInfo} from "./backup-fileinfo";

export interface IAction {
    id: number;
    path: FileInfo;
    action: string;
    parameter: string;
}

export class Action implements IAction {
    constructor(public id: number,
                public path: FileInfo,
                public action: string,
                public parameter: string ) {
    }
}
