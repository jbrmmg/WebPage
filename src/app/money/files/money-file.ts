import {Component, EventEmitter, Input, Output} from "@angular/core";
import {MoneyService} from "../money.service";
import {IFile} from "./file";
import {ButtonsModule} from "ngx-bootstrap/buttons";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'jbr-money-file',
    templateUrl: './money-file.html',
    styleUrls: ['./money-files.css'],
    imports: [
        ButtonsModule,
        NgIf,
        FormsModule
    ],
    standalone: true
})
export class MoneyFile {
    @Input() file: IFile;
    @Output() selectEmitter: EventEmitter<IFile> = new EventEmitter();

    constructor() {
    }

    getAccountImage(id: string): string {
        return MoneyService.getAccountImage(id);
    }

    loadFile(file: IFile): void {
        this.selectEmitter.emit(file);
    }
}
