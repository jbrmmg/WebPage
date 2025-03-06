/*
    private String filename;
    private LocalDateTime date;
    private Long size;
    private String md5;
 */

export interface IImportGridFile {
    filename: string;
}

export class ImportGridFile implements IImportGridFile {
    filename: string;
}
