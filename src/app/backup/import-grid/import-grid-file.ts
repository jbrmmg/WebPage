/*
    private String filename;
    private LocalDateTime date;
    private Long size;
    private String md5;
 */

import {IImportGridFileBase} from "./import-grid-file-base";

export class ImportGridFile implements IImportGridFileBase {
    filename: string;
    md5: string;
    similarFiles: IImportGridFileBase[];
}
