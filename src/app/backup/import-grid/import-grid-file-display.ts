import {IImportGridFileBase} from "./import-grid-file-base";
import {ImportGridFile} from "./import-grid-file";

export class ImportGridFileDisplay {
    id: number;
    source: ImportGridFile;
    similar: IImportGridFileBase;
    visible: boolean;
    expanded: boolean;

    constructor(id: number, source: ImportGridFile, similar: IImportGridFileBase) {
        this.id = id;
        this.source = source;
        this.similar = similar;
        this.visible = !similar;
        this.expanded = false;
    }

    display() {
        if(!this.visible) {
            this.visible = true;
        }
    }

    hide() {
        if(this.similar && this.visible) {
            this.visible = false;
        }
    }
}
