export class ImportSelectedAction {
    filename: string;
    action: string;
    parameter: string;

    constructor(filename: string, action: string, parameter: string) {
        this.filename = filename;
        this.action = action;
        this.parameter = parameter;
    }
}
