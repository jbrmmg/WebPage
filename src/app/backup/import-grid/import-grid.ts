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
import {ImportGridHeaderExpand} from "./header/import-grid-header-expand";
import {ImportGridDataExpand} from "./data/import-grid-data-expand";
import {ImportGridFileDisplay} from "./import-grid-file-display";

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
        ImportGridDataDate,
        ImportGridHeaderExpand,
        ImportGridDataExpand
    ],
    standalone: true
})
export class ImportGrid implements OnInit {
    public status: string;
    public data: ImportGridFileDisplay[];

    constructor(private readonly _importGridService: ImportGridService) {
    }

    ngOnInit(): void {
        this.status = "";
        this.data = [];
    }

    refresh() {
        this.status = "loading";
        this.data = [];
        let id: number = 0;

        // Get the data.
        this._importGridService.getFiles().subscribe({
            next: val => {
                val.forEach((e) => {
                    this.data.push(new ImportGridFileDisplay(id++,e,null));

                    if(e.similarFiles) {
                        e.similarFiles.forEach((s) => {
                            this.data.push(new ImportGridFileDisplay(id++,e,s))
                        })
                    }
                })
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
