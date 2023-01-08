import {Base} from "./base/Base";

export class ButtonRow {
    columns: Array<Base> = [];

    public addColumn(column: Base) {
        this.columns.push(column);
    }
}
