import {ImportGridFile} from "./import-grid-file";

export class ImportGridFileDisplay {
    id: number;
    source: ImportGridFile;
    visible: boolean;
    selectable: boolean;
    selected: boolean;

    constructor(id: number, source: ImportGridFile) {
        this.id = id;
        this.source = source;
        this.visible = true;
        this.selectable = true;
        this.selected = false;
    }

    display() {
        if(!this.visible) {
            this.visible = true;
        }
    }

    hide() {
        if(!this.visible) {
            this.visible = false;
        }
    }

    sizeDiff() {
        return this.source && this.source.size && this.source.importSize && this.source.size != this.source.importSize;
    }

    nameDiff() {
        return this.source && this.source.filename && this.source.importName && this.source.filename != this.source.importName;
    }

    dateDiff() {
        return this.source && this.source.date && this.source.importDate && this.source.date != this.source.importDate;
    }

    md5Diff() {
        return this.source && this.source.md5 && this.source.importMd5 && this.source.md5 != this.source.importMd5;
    }
}
