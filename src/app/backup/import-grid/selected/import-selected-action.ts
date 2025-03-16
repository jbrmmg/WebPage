export class ImportSelectedAction {
    filename: string;
    action: string;

    constructor(filename: string, action: string) {
        this.filename = filename;
        this.action = action;
    }
}
