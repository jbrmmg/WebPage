export interface IAction {
    id: number;
    path: string;
    action: string;
    parameter: string;
}

export class Action implements IAction {
    constructor(public id: number,
                public path: string,
                public action: string,
                public parameter: string ) {
    }
}
