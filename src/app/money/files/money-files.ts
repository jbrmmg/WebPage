import {Component, OnInit} from "@angular/core";
import {MoneyService} from "../money.service";
import {FileUpdate} from "../money-file-update";
import {IFile} from "../money-file";

@Component({
    selector: 'jbr-money-files',
    templateUrl: './money-files.html',
    styleUrls: ['./money-files.css']
})
export class MoneyFiles implements OnInit {
    updateText: string;
    fileUpdateSource: EventSource;
    fileUpdateTime: Date;
    files: IFile[];
    errorMessage: string;

    constructor(private _moneyService: MoneyService) {
        this.fileUpdateTime = null;
        this.fileUpdateSource = _moneyService.fileUpdateSource();
        this.fileUpdateSource.addEventListener('message', this.fileUpdate.bind(this));
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    }

    ngOnInit(): void {
        this.updateText = "not-update"

        this._moneyService.getFiles().subscribe({
            next: (files) => {
                this.files = files;
            },
            error: (response) => this.errorMessage = <any> response
        });
    }

    handleBeforeUnload(event: BeforeUnloadEvent) : void {
        this.fileUpdateSource.removeEventListener('message', this.fileUpdate.bind(this));
        this.fileUpdateSource.close();
        console.log("Cleanup before unload.");
    }

    updateFileData() {
        this.updateText = this.fileUpdateTime.toLocaleString();

        this._moneyService.getFiles().subscribe({
            next: (files) => {
                this.files = files;
            },
            error: (response) => this.errorMessage = <any> response
        });
    }

    fileUpdate(event : MessageEvent) : void {
        let update: FileUpdate = JSON.parse(event.data);

        if(this.fileUpdateTime == null || this.fileUpdateTime < update.updateTime) {
            this.fileUpdateTime = update.updateTime;
            this.updateFileData();
        }
    }
}
