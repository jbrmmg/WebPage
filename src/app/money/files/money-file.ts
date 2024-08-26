import {Component, EventEmitter, Input, Output} from "@angular/core";
import {MoneyService} from "../money.service";
import {IFile} from "./file";
import {ButtonsModule} from "ngx-bootstrap/buttons";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'jbr-money-file',
    templateUrl: './money-file.html',
    styleUrls: ['./money-files.css'],
    imports: [
        ButtonsModule,
        NgForOf,
        NgIf,
        FormsModule,
        NgClass
    ],
    standalone: true
})
export class MoneyFile {
    @Input() file: IFile;
    @Output() exitEmitter: EventEmitter<void> = new EventEmitter();

    constructor(private _moneyService: MoneyService) {
    }

    getAccountImage(id: string): string {
        return MoneyService.getAccountImage(id);
    }

    loadFile(file: IFile): void {
        this._moneyService.loadFileRequest(file);
        console.log(`Load file {}`, file.filename);
        this.exitEmitter.emit();
    }
}
