import {NgForOf, NgIf} from "@angular/common";
import {Component, OnInit, ViewChild} from "@angular/core";
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
import {ImportGridDataSelect} from "./data/import-grid-data-select";
import {ImportGridFileDisplay} from "./import-grid-file-display";
import {ImportGridHeaderStatus} from "./header/import-grid-header-status";
import {ImportGridDataStatus} from "./data/import-grid-data-status";
import {IImportGridFileBase, ImportGridFileBase} from "./import-grid-file-base";
import {ImportGridHeaderTraffic} from "./header/import-grid-header-traffic";
import {ImportGridDataTraffic} from "./data/import-grid-data-traffic";
import {ImportGridTrafficLightFilter, TrafficLightType} from "./traffic/import-grid-traffic-light";
import {ImportSelected} from "./selected/import-selected";
import {ImportSelectedAction} from "./selected/import-selected-action";

@Component({
    selector: 'jbr-import-grid',
    templateUrl: './import-grid.html',
    styleUrls: ['./import-grid.css'],
    imports: [
        NgIf,
        NgForOf,
        ImportGridHeaderName,
        ImportGridDataName,
        ImportGridHeaderMd5,
        ImportGridDataMd5,
        ImportGridHeaderSize,
        ImportGridHeaderDate,
        ImportGridDataSize,
        ImportGridDataDate,
        ImportGridHeaderExpand,
        ImportGridDataSelect,
        ImportGridHeaderStatus,
        ImportGridDataStatus,
        ImportGridHeaderTraffic,
        ImportGridDataTraffic,
        ImportSelected
    ],
    standalone: true
})
export class ImportGrid implements OnInit {
    @ViewChild('selected') selected: ImportSelected;

    public status: string;
    public data: ImportGridFileDisplay[];
    public sortColumn: string;
    public sortUp: boolean;
    public fileUpdateSource: EventSource;
    public selectedFile: ImportGridFileDisplay;
    protected readonly TrafficLightType = TrafficLightType;

    constructor(private readonly _importGridService: ImportGridService) {
        this.fileUpdateSource = _importGridService.fileUpdateSource();
        this.fileUpdateSource.addEventListener('message', this.fileUpdate.bind(this))
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    }

    ngOnInit(): void {
        this.status = "Press refresh to display.";
        this.data = [];
        this.sortColumn = "Name";
        this.selectedFile = null;
    }

    handleBeforeUnload(event: BeforeUnloadEvent) : void {
        this.fileUpdateSource.removeEventListener('message', this.fileUpdate.bind(this));
        this.fileUpdateSource.close();
        console.log("Cleanup before unload." + event);
    }

    updateFileDataBase(data: IImportGridFileBase, update: ImportGridFileBase) {
        if(data.md5 != update.md5) {
            data.md5 = update.md5;
        }
        if(data.size != update.size) {
            data.size = update.size;
        }
        if(data.date != update.date) {
            data.date = update.date;
        }
    }

    updateFileData(data: ImportGridFile, update: ImportGridFile) {
        // Have the details changed?
        this.updateFileDataBase(data,update);

        if(data.immediateImported != update.immediateImported) {
            data.immediateImported = update.immediateImported;
        }
        if(data.imported != update.imported) {
            data.imported = update.imported;
        }
        if(data.ignored != update.ignored) {
            data.ignored = update.ignored;
        }
        if(data.duplicated != update.duplicated) {
            data.duplicated = update.duplicated;
        }
    }

    fileUpdate(event : MessageEvent) : void {
        let update: ImportGridFile[] = JSON.parse(event.data);

        update.forEach(f => {
            let index = 0;
            this.data.forEach(d => {
                index++;
                if(!d.source) {
                    return;
                }

                if(f.filename != d.source.filename) {
                    return;
                }

                this.updateFileData(d.source,f);
            });
        });
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
                    this.data.push(new ImportGridFileDisplay(id++,e));
                    count++;
                })
                this.sortData(this.sortColumn,false);
                this._importGridService.restart().subscribe({
                    complete: () => {
                        console.log("Restarted.")
                    }
                });
            },
            error: err => {
                // Error
                console.log(err);
            },
            complete: () => {
                // Completed
                if(this.data && this.data.length > 0) {
                    this.selectRequest(this.data[0]);
                }
                this.status = count + " files loaded";
            }
        });
    }

    selectRequest(data: ImportGridFileDisplay){
        // If this is already selected, then nothing to do.
        if(data.selected) {
            return;
        }

        // Make the current selected un selected.
        this.data.forEach(f => {
            if(f.selected) {
                f.selected = false;
            }
        });

        data.selected = true;
        this.selectedFile = data;
        this.selected.selectionChange(data);
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
                return this.sortUp ? 1 : -1;
            }

            if(this.nameSorter(f1.source) < this.nameSorter(f2.source)) {
                return this.sortUp ? -1 : 1;
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
                return this.sortUp ? 1 : -1;
            }

            if(this.sizeSorter(f1.source) < this.sizeSorter(f2.source)) {
                return this.sortUp ? -1 : 1;
            }

            return 0;
        })
    }

    statusSorter(file: ImportGridFile): string {
        if(file) {
            let result: string = "";

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

    statusFlagSorter(file: ImportGridFile, type: TrafficLightType): string {
        if(file) {
            switch(type) {
                case TrafficLightType.ImmediateImportStatus:
                    return file.immediateImported;
                case TrafficLightType.IgnoreStatus:
                    return file.ignored;
                case TrafficLightType.ImportStatus:
                    return file.imported;
                case TrafficLightType.DuplicateStatus:
                    return file.duplicated;
            }
        }

        return "";
    }

    sortFlagStatus(type: TrafficLightType) {
        this.data = this.data.sort((f1,f2) => {
            if(this.statusFlagSorter(f1.source,type) > this.statusFlagSorter(f2.source,type)) {
                return this.sortUp ? 1 : -1;
            }

            if(this.statusFlagSorter(f1.source,type) < this.statusFlagSorter(f2.source,type)) {
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
            case "Immediate":
                this.sortFlagStatus(TrafficLightType.ImmediateImportStatus);
                break;
            case "Ignore":
                this.sortFlagStatus(TrafficLightType.IgnoreStatus);
                break;
            case "Import":
                this.sortFlagStatus(TrafficLightType.ImportStatus);
                break;
            case "Duplicate":
                this.sortFlagStatus(TrafficLightType.DuplicateStatus);
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

    getVisible(statusName: string, filter: ImportGridTrafficLightFilter) {
        switch(statusName) {
            case "TL_RED":
                return filter.red;
            case "TL_AMBER":
                return filter.amber;
            case "TL_GREEN":
                return filter.green;
        }

        return filter.unknown;
    }

    filterStatus(filter: ImportGridTrafficLightFilter) {
        // Hide those rows that do not match the filter.
        this.data.forEach(d => {
            switch(filter.type) {
                case TrafficLightType.ImmediateImportStatus:
                    d.visible = this.getVisible(d.source.immediateImported,filter);
                    break;
                case TrafficLightType.IgnoreStatus:
                    d.visible = this.getVisible(d.source.ignored,filter);
                    break;
                case TrafficLightType.ImportStatus:
                    d.visible = this.getVisible(d.source.imported,filter);
                    break;
                case TrafficLightType.DuplicateStatus:
                    d.visible = this.getVisible(d.source.duplicated,filter);
                    break;
            }
        });
    }

    deleteFile(filename: string) {
        // Find the name of the next file (this will be selected next)
        let nextFile: string;
        let next: boolean = false;
        this.data.forEach(f => {
           if(f.source.filename == filename) {
               next = true;
           } else if (next) {
               nextFile = f.source.filename;
               next = false;
           }
        });

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

                    // Select the file.
                    this.data.forEach(f => {
                       if(f.source.filename == nextFile) {
                           this.selectRequest(f);
                       }
                    });

                    console.log('Delete complete');
                }
            }
        );
    }

    previousAction(file: string) {
        // Select the file before
        let previous: ImportGridFileDisplay = null;
        this.data.forEach(f => {
            if(f.source.filename == file){
                if(previous) {
                    return this.selectRequest(previous);
                } else {
                    // No previous, return the last entry.
                    this.selectRequest(this.data[this.data.length-1]);
                }
            }

            previous = f;
        });
    }

    nextAction(file: string) {
        // Select the file after
        let next: boolean = false;
        let selected: boolean = false;
        this.data.forEach(f => {
           if(next) {
               next = false;
               selected = true;
               return this.selectRequest(f);
           }

           if(f.source.filename == file) {
               next = true;
           }
        });

        // If nothing selected, select the first item.
        if(!selected) {
            if(this.data && this.data.length > 0) {
                this.selectRequest(this.data[0]);
            }
        }
    }

    action(action: ImportSelectedAction) {
        // Process the action.
        switch(action.action) {
            case "previous":
                return this.previousAction(action.filename);
            case "next":
                return this.nextAction(action.filename);
            case "delete":
                return this.deleteFile(action.filename);
        }
    }
}
