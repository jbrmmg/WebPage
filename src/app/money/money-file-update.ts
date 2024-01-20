/*
 * Equivalent ReconcileFileDataUpdateDTO
 */

export interface IFileUpdate {
    updateTime: Date;
    path: string;
}

export class FileUpdate implements IFileUpdate{
    public updateTime: Date;
    public path: string;
}
