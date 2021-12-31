export class LogsDate {
    logDate: Date;
    logDateString: String;
    selected: boolean;

    constructor(logDate: Date) {
        this.logDate = new Date();
        this.logDate.setDate(logDate.getDate());
        this.selected = false;
        this.logDateString = ('0' + logDate.getDate().toString()).slice(-2);
        this.logDateString += '-';
        switch (logDate.getMonth()) {
            case 0:
                this.logDateString += 'Jan';
                break;
            case 1:
                this.logDateString += 'Feb';
                break;
            case 2:
                this.logDateString += 'Mar';
                break;
            case 3:
                this.logDateString += 'Apr';
                break;
            case 4:
                this.logDateString += 'May';
                break;
            case 5:
                this.logDateString += 'Jun';
                break;
            case 6:
                this.logDateString += 'Jul';
                break;
            case 7:
                this.logDateString += 'Aug';
                break;
            case 8:
                this.logDateString += 'Sep';
                break;
            case 9:
                this.logDateString += 'Oct';
                break;
            case 10:
                this.logDateString += 'Nov';
                break;
            case 11:
                this.logDateString += 'Dec';
                break;
        }
        this.logDateString += '-';
        this.logDateString += logDate.getFullYear().toString();
    }
}
