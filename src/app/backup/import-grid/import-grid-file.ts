import {IImportGridFileBase} from "./import-grid-file-base";

export class ImportGridFile implements IImportGridFileBase {
    filename: string;
    date: string;
    size: number;
    md5: string;
    similarFiles: IImportGridFileBase[];
    ignored: string;
    imported: string;
    immediateImported: string;
    duplicated: string;
    id: number;
    status: string;
}
