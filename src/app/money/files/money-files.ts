import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {MoneyService} from '../money.service';
import {FileUpdate} from './fileUpdate';
import {IFile} from './file';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MoneyFile} from './money-file';

@Component({
    selector: 'jbr-money-files',
    templateUrl: './money-files.html',
    styleUrls: ['./money-files.css'],
    imports: [
        ButtonsModule,
        NgForOf,
        FormsModule,
        MoneyFile
    ],
    host: {'style': 'padding: 0;'},
    standalone: true
})
export class MoneyFiles implements OnInit {
    updateText: string;
    fileUpdateSource: EventSource;
    fileUpdateTime: Date = null;
    files: IFile[];
    errorMessage: string;
    @Input() selectFileEmitter: EventEmitter<IFile>;

    constructor(private _moneyService: MoneyService) {
        this.fileUpdateSource = _moneyService.fileUpdateSource();
        this.fileUpdateSource.addEventListener('message', this.fileUpdate.bind(this));
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    }

    ngOnInit(): void {
        this.updateText = 'not-update';

        this._moneyService.getFiles().subscribe({
            next: (files) => {
                this.files = files;
            },
            error: (response) => this.errorMessage = response
        });
    }

    handleBeforeUnload(_event: BeforeUnloadEvent): void {
        this.fileUpdateSource.removeEventListener('message', this.fileUpdate.bind(this));
        this.fileUpdateSource.close();
        console.log('Cleanup before unload.');
    }

    updateFileData() {
        this.updateText = this.fileUpdateTime.toLocaleString();

        this._moneyService.getFiles().subscribe({
            next: (files) => {
                this.files = files;
            },
            error: (response) => this.errorMessage = response
        });
    }

    fileUpdate(event: MessageEvent): void {
        const update: FileUpdate = JSON.parse(event.data);

        if (this.fileUpdateTime == null || this.fileUpdateTime < update.updateTime) {
            this.fileUpdateTime = update.updateTime;
            this.updateFileData();
        }
    }

    onSelectFile(file: IFile) {
        this.selectFileEmitter.emit(file);
    }
}
