

export interface IImportGridFileBase {
    filename: string;
    date: string;
    size: number;
    md5: string;
}

export class ImportGridFileBase implements IImportGridFileBase {
    filename: string;
    date: string;
    size: number;
    md5: string;
}
