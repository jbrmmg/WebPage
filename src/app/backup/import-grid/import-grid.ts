import {NgForOf, NgIf} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {ImportGridHeaderName} from "./header/import-grid-header-name";
import {ImportGridDataName} from "./data/import-grid-data-name";
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
        NgForOf
    ],
    standalone: true
})
export class ImportGrid implements OnInit {
    public status: string;
    public data: ImportGridFile[];

    constructor(private readonly _importGridService: ImportGridService) {
    }

    ngOnInit(): void {
        this.status = "testing";
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
