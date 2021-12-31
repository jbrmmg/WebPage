import {ILogsType} from './logs-type';

export class LogsSelectedType {
    type: ILogsType;
    selected: boolean;

    constructor(type: ILogsType) {
        this.type = type;
        this.selected = false;
    }
}
