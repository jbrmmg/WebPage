import {NgForOf, NgIf} from "@angular/common";
import {Component, OnInit, TemplateRef, ViewChild} from "@angular/core";
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
import {IImportGridFileBase, ImportGridFileBase} from "./import-grid-file-base";
import {ImportGridHeaderTraffic} from "./header/import-grid-header-traffic";
import {ImportGridDataTraffic} from "./data/import-grid-data-traffic";
import {ImportGridTrafficLightFilter, TrafficLightType} from "./traffic/import-grid-traffic-light";
import {ImportSelected} from "./selected/import-selected";
import {ImportSelectedAction} from "./selected/import-selected-action";
import {ImportGridStatus} from "./status/import-grid-status";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ImportGridHeaderDestination} from "./header/import-grid-header-destination";
import {ImportGridDataDestination} from "./data/import-grid-data-destination";

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
        ImportGridHeaderTraffic,
        ImportGridDataTraffic,
        ImportSelected,
        ImportGridStatus,
        ImportGridHeaderDestination,
        ImportGridDataDestination
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
    public afterRefresh: string;
    public limit: number;
    public fileForDelete: string;
    protected readonly TrafficLightType = TrafficLightType;
    modalRef: BsModalRef;

    constructor(private readonly _importGridService: ImportGridService,
                private modalService: BsModalService) {
        this.fileUpdateSource = _importGridService.fileUpdateSource();
        this.fileUpdateSource.addEventListener('message', this.fileUpdate.bind(this))
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    }

    ngOnInit(): void {
        this.status = "Press refresh to display, or remove ignored, covert or remove duplicates.";
        this.data = [];
        this.sortColumn = "Name";
        this.selectedFile = null;
        this.limit = 20;
    }

    handleBeforeUnload(event: BeforeUnloadEvent) : void {
        this.fileUpdateSource.removeEventListener('message', this.fileUpdate.bind(this));
        this.fileUpdateSource.close();
        console.log("Cleanup before unload." + event);
    }

    changeLimit(limitChange: number) {
        this.limit += limitChange;
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

        // Is this the selected file?
        if(this.selectedFile && this.selectedFile.source && this.selectedFile.source.filename == data.filename) {
            this.selectRequestByName(data.filename);
        }
    }

    updateLatLong(data: ImportGridFile, update: ImportGridFile) {
        // If no lat/long then just retur.
        if(!update.location && !data.location) {
            return;
        }

        // location has been removed.
        if(!update.location && data.location) {
            data.location = null;
            return;
        }

        // Location has been added.
        if(update.location && !data.location) {
            data.location = update.location;
            return;
        }

        // Update location.
        if(update.location.lat != data.location.lat) {
            data.location.lat = update.location.lat;
        }
        if(update.location.long != data.location.long) {
            data.location.long = update.location.long;
        }
    }

    updateImageSize(data: ImportGridFile, update: ImportGridFile) {
        // If no image size then just return.
        if(!update.imageSize && !data.imageSize) {
            return;
        }

        // image size has been removed.
        if(!update.imageSize && data.imageSize) {
            data.imageSize = null;
            return;
        }

        // image size has been added.
        if(update.imageSize && !data.imageSize) {
            data.imageSize = update.imageSize;
            return;
        }

        // Image size changed.
        if(update.imageSize.height != data.imageSize.height) {
            data.imageSize.height = update.imageSize.height;
        }
        if(update.imageSize.width != data.imageSize.width) {
            data.imageSize.width = update.imageSize.width;
        }
    }

    updateStatus(data: ImportGridFile, update: ImportGridFile) {
        // Update the status flags.
        if(data.stepStatus.readPreImportFile != update.stepStatus.readPreImportFile) {
            data.stepStatus.readPreImportFile = update.stepStatus.readPreImportFile;
        }
        if(data.stepStatus.gatherMetaData != update.stepStatus.gatherMetaData) {
            data.stepStatus.gatherMetaData = update.stepStatus.gatherMetaData;
        }
        if(data.stepStatus.copyFileToImport != update.stepStatus.copyFileToImport) {
            data.stepStatus.copyFileToImport = update.stepStatus.copyFileToImport;
        }
        if(data.stepStatus.checkFileIgnored != update.stepStatus.checkFileIgnored) {
            data.stepStatus.checkFileIgnored = update.stepStatus.checkFileIgnored;
        }
        if(data.stepStatus.checkActivePhotoFile != update.stepStatus.checkActivePhotoFile) {
            data.stepStatus.checkActivePhotoFile = update.stepStatus.checkActivePhotoFile;
        }
        if(data.stepStatus.checkDuplicateFile != update.stepStatus.checkDuplicateFile) {
            data.stepStatus.checkDuplicateFile = update.stepStatus.checkDuplicateFile;
        }
        if(data.stepStatus.checkFileConfirmedImported != update.stepStatus.checkFileConfirmedImported) {
            data.stepStatus.checkFileConfirmedImported = update.stepStatus.checkFileConfirmedImported;
        }
        if(data.stepStatus.competed != update.stepStatus.competed) {
            data.stepStatus.competed = update.stepStatus.competed;
        }
    }

    updateSimilar(data: ImportGridFile, update: ImportGridFile) {
        // if no similar files just return.
        if(!data.similarFiles && !update.similarFiles) {
            return;
        }

        // similar files have been removed has been removed.
        if(!update.similarFiles && data.similarFiles) {
            data.similarFiles = null;
            return;
        }

        // image size has been added.
        if(update.similarFiles && !data.similarFiles) {
            data.similarFiles = update.similarFiles;
            return;
        }

        // Have the number of similar files changed?
        if(update.similarFiles.length != data.similarFiles.length) {
            data.similarFiles = update.similarFiles;
            return;
        }

        // Have any similar files been added or removed?
        let added: boolean = false;
        update.similarFiles.forEach(uf => {
            let found: boolean = false;
            data.similarFiles.forEach(f => {
                  if(uf.filename == f.filename) {
                      found = true;
                      return;
                  }
            });

            if(!found) {
                added = true;
                return;
            }
        });
        if(added) {
            data.similarFiles = update.similarFiles;
            return;
        }

        let removed: boolean = false;
        data.similarFiles.forEach(f => {
            let found: boolean = false;
            update.similarFiles.forEach(uf => {
                if(f.filename == uf.filename) {
                    found = true;
                    return;
                }
            })

            if(!found) {
                removed = true;
                return;
            }
        });
        if(removed) {
            data.similarFiles = update.similarFiles;
            return;
        }

        // Update the individual files.
        data.similarFiles.forEach(f => {
           update.similarFiles.forEach( uf => {
               if(f.filename == uf.filename) {
                   if(f.md5 != uf.md5) {
                       f.md5 = uf.md5;
                   }
                   if(f.date != uf.date) {
                       f.date = uf.date;
                   }
                   if(f.size != uf.size) {
                       f.size = uf.size;
                   }
               }
           })
        });
    }

    updateFileData(data: ImportGridFile, update: ImportGridFile) {
        // Have the details changed?
        this.updateFileDataBase(data,update);

        if(data.destination != update.destination) {
            data.destination = update.destination;
        }
        if(data.importName != update.importName) {
            data.importName = update.importName;
        }
        if(data.duration != update.duration) {
            data.duration = update.duration;
        }
        if(data.importDate != update.importDate) {
            data.importDate = update.importDate;
        }
        if(data.importSize != update.importSize) {
            data.importSize = update.importSize;
        }
        if(data.importMd5 != update.importMd5) {
            data.importMd5 = update.importMd5;
        }
        if(data.errorInPostImport != update.errorInPostImport) {
            data.errorInPostImport = update.errorInPostImport;
        }
        if(data.errorInImport != update.errorInImport) {
            data.errorInImport = update.errorInImport;
        }
        if(data.processed != update.processed) {
            data.processed = update.processed;
        }
        if(data.inDatabase != update.inDatabase) {
            data.inDatabase = update.inDatabase;
        }
        if(data.inImport != update.inImport) {
            data.inImport = update.inImport;
        }
        if(data.inPostImport != update.inPostImport) {
            data.inPostImport = update.inPostImport;
        }
        if(data.image != update.image) {
            data.image = update.image;
        }
        if(data.video != update.video) {
            data.video = update.video;
        }

        this.updateLatLong(data,update);
        this.updateImageSize(data,update);
        this.updateStatus(data,update);
        this.updateSimilar(data,update);
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

    selectRequestByName(filename: string) {
        this.data.forEach(f => {
           if(f.source.filename == filename) {
               // Force the update
               f.selected = false;
               this.selectRequest(f);
           }
        });
    }

    refresh() {
        this.status = "loading";
        this.data = [];
        let id: number = 0;
        let count: number = 0;

        // Get the data.
        this._importGridService.getFiles(this.limit).subscribe({
            next: val => {
                val.forEach((e) => {
                    this.data.push(new ImportGridFileDisplay(id++,e));
                    count++;
                })
                this.sortData(this.sortColumn,false);
            },
            error: err => {
                // Error
                console.log(err);
            },
            complete: () => {
                // Completed
                if (this.afterRefresh && this.afterRefresh.length > 0) {
                    // If specified, then select this file.
                    this.selectRequestByName(this.afterRefresh);
                    this.afterRefresh = "";
                } else {
                    // Just select the first.
                    if (this.data && this.data.length > 0) {
                        this.selectRequest(this.data[0]);
                    }
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

            result += file.stepStatus.readPreImportFile;

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
                    return file.stepStatus.readPreImportFile;
                case TrafficLightType.IgnoreStatus:
                    return file.stepStatus.checkFileIgnored;
                case TrafficLightType.ImportStatus:
                    return file.stepStatus.checkFileConfirmedImported;
                case TrafficLightType.DuplicateStatus:
                    return file.stepStatus.checkDuplicateFile;
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

    deleteRejected() {
        if(this.modalRef) {
            this.modalRef.hide();
        }
    }

    ignoreFile(file: string) {
        // Ignore the file.
        this.status = "Ignoring the file."
        this._importGridService.ignore(file).subscribe({
                next: (result) => {
                    console.log(result);
                },
                error: err => {
                    // Error.
                    this.status = "Ignore file failed - check log."
                    console.log('There is an error?' + err.message)
                },
                complete: () => {
                    this.status = "File ignored."
                    this.refresh();
                    console.log('Ignore complete');
                }
            }
        );
    }

    recipeFile(file: string) {
        // Mark the file as a recipe
        this.status = "Marking the file as a recipe."
        this._importGridService.recipe(file).subscribe({
                next: (result) => {
                    console.log(result);
                },
                error: err => {
                    // Error.
                    this.status = "Failed to mark file as a recipe - check log."
                    console.log('There is an error?' + err.message)
                },
                complete: () => {
                    this.status = "File marked as recipe."
                    this.refresh();
                    console.log('Mark as recipe complete complete');
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

    action(action: ImportSelectedAction, template: TemplateRef<any>) {
        // Process the action.
        switch(action.action) {
            case "previous":
                return this.previousAction(action.filename);
            case "next":
                return this.nextAction(action.filename);
            case "ignore":
                return this.ignoreFile(action.filename);
            case "recipe":
                return this.recipeFile(action.filename);
        }
    }

    removeIgnored() {
        this.status = "Removing Ignored files from the import directory";
        this._importGridService.removeIgnored().subscribe({
            next: (result) => {
                console.log(result);
            },
            error: err => {
                // Error.
                this.status = "Remove ignored failed - check log";
                console.log('There is an error?' + err.message)
            },
            complete: () => {
                console.log('Remove ignored complete');
                this.status = "Remove ignored complete";
                this.refresh();
            }
        });
    }

    importFiles() {
        this.status = "Importing the files, converting and importing details into database.";
        this._importGridService.importFiles().subscribe({
            next: (result) => {
                console.log(result);
            },
            error: err => {
                this.status = "Importing files failed - check log";
                console.log('There is an error?' + err.message)
            },
            complete: () => {
                console.log('Import files complete');
                this.status = "Import files complete";
                this.refresh();
            }
        });
    }

    removeDuplicates() {
        this.status = "Removing duplicate files from the import directory.";
        this._importGridService.removeDuplicates().subscribe({
            next: (result) => {
                console.log(result);
            },
            error: err => {
                this.status = "Remove duplicates failed - check log";
                console.log('There is an error?' + err.message)
            },
            complete: () => {
                console.log('Remove duplicates complete');
                this.status = "Remove duplicates complete";
                this.refresh();
            }
        });
    }

    process() {
        this.status = "Processing the files listed below.";
        this._importGridService.process().subscribe({
            next: (result) => {
                console.log(result);
            },
            error: err => {
                this.status = "Process files failed - check log";
                console.log('There is an error?' + err.message)
            },
            complete: () => {
                console.log('Process files complete');
                this.status = "Process files complete";
                this.refresh();
            }
        });
    }
}
