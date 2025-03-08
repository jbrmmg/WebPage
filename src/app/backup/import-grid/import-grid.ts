import {NgForOf, NgIf} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {ImportGridHeaderName} from "./header/import-grid-header-name";
import {ImportGridHeaderMd5} from "./header/import-grid-header-md5";
import {ImportGridHeaderSize} from "./header/import-grid-header-size";
import {ImportGridHeaderDate} from "./header/import-grid-header-date";
import {ImportGridDataName} from "./data/import-grid-data-name";
import {ImportGridDataMd5} from "./data/import-grid-data-md5";
import {ImportGridDataSize} from "./data/import-grid-data-size";
import {ImportGridDataDate} from "./data/import-grid-data-date";
import {ImportGridService} from "./import-grid.service";
import {ImportGridFile} from "./import-grid-file";

@Component({
    selector: 'jbr-import-grid',
    templateUrl: './import-grid.html',
    styleUrls: ['./import-grid.css'],
    imports: [
        NgIf,
        ImportGridHeaderName,
        ImportGridDataName,
        NgForOf,
        ImportGridHeaderMd5,
        ImportGridDataMd5,
        ImportGridHeaderSize,
        ImportGridHeaderDate,
        ImportGridDataSize,
        ImportGridDataDate
    ],
    standalone: true
})
export class ImportGrid implements OnInit {
    public status: string;
    public data: ImportGridFile[];

    constructor(private readonly _importGridService: ImportGridService) {
    }

    ngOnInit(): void {
        this.status = "";
        this.data = [];
    }

    refresh() {
        this.status = "loading";
        this.data = [];

        // Get the data.
        this._importGridService.getFiles().subscribe({
            next: val => {
                this.data = val;
            },
            error: err => {
                // Error.
            },
            complete: () => {
                // Completed
                this.status = this.data.length + " loaded";
            }
        });
    }
}
