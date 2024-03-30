import {Component, Input} from "@angular/core";
import {MoneyService} from "../money.service";
import {IFile} from "./file";

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

    loadFile(file: IFile): void {
        this._moneyService.loadFileRequest(file);
        console.log(`Load file {}`, file.filename);
    }
}
