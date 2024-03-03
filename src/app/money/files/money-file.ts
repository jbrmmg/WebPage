import {Component, Input} from "@angular/core";
import {MoneyService} from "../money.service";
import {IFile} from "../money-file";
import {JbAccount} from "../money-jbaccount";

@Component({
    selector: 'jbr-money-file',
    templateUrl: './money-file.html',
    styleUrls: ['./money-files.css']
})
export class MoneyFile {
    @Input() file: IFile;

    constructor(private _moneyService: MoneyService) {
    }

    getAccountImage(id: string): string {
        return MoneyService.getAccountImage(id);
    }

    loadFile(filename: string, account: JbAccount): void {
        if(account != null) {
            this._moneyService.loadFileRequest2(filename, account);
            console.log(filename);
        }
    }
}
