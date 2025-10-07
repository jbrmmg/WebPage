export interface IVersion {
    version: string;
}

export class Version implements IVersion {
    constructor(public version: string) {
    }
}
