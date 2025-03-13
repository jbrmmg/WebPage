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
import {ImportGridHeaderStatus} from "./header/import-grid-header-status";
import {ImportGridDataStatus} from "./data/import-grid-data-status";
import {FileUpdate} from "../../money/files/fileUpdate";

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
        ImportGridDataExpand,
        ImportGridHeaderStatus,
        ImportGridDataStatus
    ],
    standalone: true
})
export class ImportGrid implements OnInit {
    public status: string;
    public data: ImportGridFileDisplay[];
    public sortColumn: string;
    public sortUp: boolean;
    public fileUpdateSource: EventSource;

    constructor(private readonly _importGridService: ImportGridService) {
        this.fileUpdateSource = _importGridService.fileUpdateSource();
        this.fileUpdateSource.addEventListener('message', this.fileUpdate.bind(this))
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    }

    ngOnInit(): void {
        this.status = "Press refresh to display.";
        this.data = [];
        this.sortColumn = "Name";
    }

    handleBeforeUnload(event: BeforeUnloadEvent) : void {
        this.fileUpdateSource.removeEventListener('message', this.fileUpdate.bind(this));
        this.fileUpdateSource.close();
        console.log("Cleanup before unload." + event);
    }

    fileUpdate(event : MessageEvent) : void {
        let update: ImportGridFile[] = JSON.parse(event.data);

        console.log("Update " + update.length)
        if(update.length > 0) {
            if(update[0].filename) {
                console.log(update[0].filename);
            } else {
                console.log("null")
            }
        }
//        update.forEach(x => {
//            console.log("Update for " + x.filename);
//        })
    }

    refresh() {
        this.status = "loading";
        this.data = [];
        let id: number = 0;
        let count: number = 0;

        // Get the data.
        this._importGridService.getFiles().subscribe({
            next: val => {
                val.forEach((e) => {
                    this.data.push(new ImportGridFileDisplay(id++,e,null));
                    count++;

                    if(e.similarFiles) {
                        e.similarFiles.forEach((s) => {
                            this.data.push(new ImportGridFileDisplay(id++,e,s))
                        })
                    }
                })
                this.sortData(this.sortColumn,false);
                this._importGridService.restart().subscribe({
                    complete: () => {
                        console.log("Restarted.")
                    }
                });
            },
            error: err => {
                // Error.
            },
            complete: () => {
                // Completed
                this.status = count + " files loaded";
            }
        });
    }

    expandRequest(data: ImportGridFileDisplay){
        // Make all the similar files invisible.
        this.data.forEach((f) => {
            if(f.similar) {
                f.visible = false;
            }
        })

        // Is the current data expanded?
        if(data.expanded) {
            data.expanded = false;
            return;
        } else {
            // If not, the collapse all the others.
            this.data.forEach((f) => {
                if(f.similar == null) {
                    f.expanded = false;
                }
            })
        }

        // Set the similar files to this to be visible.
        data.expanded = true;
        this.data.forEach((f) => {
            if(f.source == data.source && f.similar) {
                f.visible = true;
            }
        })
    }

    nameSorter(name: ImportGridFile): string {
        if(name && name.filename) {
            return name.filename.toLowerCase();
        }

        return "";
    }

    sortName() {
        this.data = this.data.sort((f1,f2) => {
            if(this.nameSorter(f1.source) > this.nameSorter(f2.source)) {
                return 1;
            }

            if(this.nameSorter(f1.source) < this.nameSorter(f2.source)) {
                return -1;
            }

            return 0;
        })
    }

    sizeSorter(file: ImportGridFile): number {
        if(file) {
            return file.size;
        }

        return 0;
    }

    sortSize() {
        this.data = this.data.sort((f1,f2) => {
            if(this.sizeSorter(f1.source) > this.sizeSorter(f2.source)) {
                return 1;
            }

            if(this.sizeSorter(f1.source) < this.sizeSorter(f2.source)) {
                return -1;
            }

            return 0;
        })
    }

    statusSorter(file: ImportGridFile): string {
        if(file) {
            let result: string = "";

            result += file.ignored;
            result += file.immediateImported;
            result += file.imported;
            result += file.duplicated;
            result += file.status;

            return result;
        }

        return "";
    }

    sortStatus() {
        this.data = this.data.sort((f1,f2) => {
            if(this.statusSorter(f1.source) > this.statusSorter(f2.source)) {
                return this.sortUp ? 1 : -1;
            }

            if(this.statusSorter(f1.source) < this.statusSorter(f2.source)) {
                return this.sortUp ? -1 : 1;
            }

            return 0;
        })
    }

    dateSorter(file: ImportGridFile): string{
        if(file) {
            return file.date;
        }

        return "";
    }

    sortDate() {
        this.data = this.data.sort((f1,f2) => {
            if(this.dateSorter(f1.source) > this.dateSorter(f2.source)) {
                return this.sortUp ? 1 : -1;
            }

            if(this.dateSorter(f1.source) < this.dateSorter(f2.source)) {
                return this.sortUp ? -1 : 1;
            }

            return 0;
        })
    }

    md5Sorter(file: ImportGridFile): string {
        if(file) {
            if (file.md5) {
                return file.md5.toUpperCase();
            }
        }

        return "";
    }

    sortMD5() {
        this.data = this.data.sort((f1,f2) => {
            if(this.md5Sorter(f1.source) > this.md5Sorter(f2.source)) {
                return this.sortUp ? 1 : -1;
            }

            if(this.md5Sorter(f1.source) < this.md5Sorter(f2.source)) {
                return this.sortUp ? -1 : 1;
            }

            return 0;
        })
    }

    sortData(column: string, flipOrder: boolean) {
        let oldStatus: string = this.status

        if(flipOrder && column == this.sortColumn) {
            this.sortUp = !this.sortUp;
        }

        this.status = "Sorting";
        switch (column) {
            case "Name":
                this.sortName();
                break;
            case "Size":
                this.sortSize();
                break;
            case "MD5":
                this.sortMD5();
                break;
            case "Status":
                this.sortStatus();
                break;
            case "Date":
                this.sortDate();
        }
        this.status = oldStatus;
        this.sortColumn = column;
    }

    deleteFile(filename: string) {
        // Delete the file named.
        this.data = []
        this._importGridService.deletePreImportFile(filename).subscribe({
                next: (result) => {
                    console.log(result);
                },
                error: err => {
                    // Error.
                    console.log('There is an error?' + err.message)
                },
                complete: () => {
                    this.refresh();
                    console.log('Delete complete');
                }
            }
        );
    }
}
