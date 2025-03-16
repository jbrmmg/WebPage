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
}
