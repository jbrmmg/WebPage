import {IImportGridFileBase} from "./import-grid-file-base";

export class ImportGridFile implements IImportGridFileBase {
    filename: string;
    date: string;
    size: number;
    md5: string;
    similarFiles: IImportGridFileBase[];
}
