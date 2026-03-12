import {NgForOf, NgIf} from '@angular/common';
import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ImportGridHeaderName} from './header/import-grid-header-name';
import {ImportGridHeaderMd5} from './header/import-grid-header-md5';
import {ImportGridHeaderSize} from './header/import-grid-header-size';
import {ImportGridHeaderDate} from './header/import-grid-header-date';
import {ImportGridDataName} from './data/import-grid-data-name';
import {ImportGridDataMd5} from './data/import-grid-data-md5';
import {ImportGridDataSize} from './data/import-grid-data-size';
import {ImportGridDataDate} from './data/import-grid-data-date';
import {ImportGridService} from './import-grid.service';
import {ImportGridFile} from './import-grid-file';
import {ImportGridHeaderExpand} from './header/import-grid-header-expand';
import {ImportGridDataSelect} from './data/import-grid-data-select';
import {ImportGridFileDisplay} from './import-grid-file-display';
import {IImportGridFileBase, ImportGridFileBase} from './import-grid-file-base';
import {ImportGridHeaderTraffic} from './header/import-grid-header-traffic';
import {ImportGridDataTraffic} from './data/import-grid-data-traffic';
import {ImportSelected} from './selected/import-selected';
import {ImportSelectedAction} from './selected/import-selected-action';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {ImportGridHeaderDestination} from './header/import-grid-header-destination';
import {ImportGridDataDestination} from './data/import-grid-data-destination';
import {ImportGridSummary} from './summary/import-grid-summary';
import {ImportGridSummaryCount} from './summary/import-grid-summary-count';
import {ListFilterType} from './import-grid-filter';
import {FileDestinationUpdate} from './import-grid-update-destination';

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
        ImportGridHeaderDestination,
        ImportGridDataDestination,
        ImportGridSummary
    ],
    standalone: true
})
export class ImportGrid implements OnInit {
    @ViewChild('selected') selected: ImportSelected;

    public status: string;
    public data: ImportGridFileDisplay[];
    public summary: ImportGridSummaryCount;
    public sortColumn: string;
    public sortUp: boolean;
    public fileUpdateSource: EventSource;
    public summaryUpdateSource: EventSource;
    public selectedFile: ImportGridFileDisplay;
    public afterRefresh: string;
    public filter: ListFilterType;
    public fileForDelete: string;
    modalRef: BsModalRef;

    constructor(private readonly _importGridService: ImportGridService,
                private readonly modalService: BsModalService) {
        this.fileUpdateSource = _importGridService.fileUpdateSource();
        this.fileUpdateSource.addEventListener('message', this.fileUpdate.bind(this));

        this.summaryUpdateSource = _importGridService.summaryUpdateSource();
        this.summaryUpdateSource.addEventListener('message', this.summaryUpdate.bind(this));

        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    }

    ngOnInit(): void {
        this.status = 'Press refresh to display, or remove ignored, covert or remove duplicates.';
        this.data = [];
        this.sortColumn = 'Name';
        this.selectedFile = null;
        this.filter = null;
    }

    handleBeforeUnload(_event: BeforeUnloadEvent): void {
        this.fileUpdateSource.removeEventListener('message', this.fileUpdate.bind(this));
        this.fileUpdateSource.close();
        this.summaryUpdateSource.removeEventListener('message', this.summaryUpdate.bind(this));
        this.summaryUpdateSource.close();
        console.log('Cleanup before unload.');
    }

    updateFileDataBase(data: IImportGridFileBase, update: ImportGridFileBase) {
        if (data.md5 !== update.md5) {
            data.md5 = update.md5;
        }
        if (data.size !== update.size) {
            data.size = update.size;
        }
        if (data.date !== update.date) {
            data.date = update.date;
        }

        // Is this the selected file?
        if (this.selectedFile?.source?.filename === data.filename) {
            this.selectRequestByName(data.filename);
        }
    }

    updateLatLong(data: ImportGridFile, update: ImportGridFile) {
        // If no lat/ long, then just return.
        if (!update.location && !data.location) {
            return;
        }

        // location has been removed.
        if (!update.location && data.location) {
            data.location = null;
            return;
        }

        // Location has been added.
        if (update.location && !data.location) {
            data.location = update.location;
            return;
        }

        // Update location.
        if (update.location.lat !== data.location.lat) {
            data.location.lat = update.location.lat;
        }
        if (update.location.long !== data.location.long) {
            data.location.long = update.location.long;
        }
    }

    updateImageSize(data: ImportGridFile, update: ImportGridFile) {
        // If no image size, then just return.
        if (!update.imageSize && !data.imageSize) {
            return;
        }

        // image size has been removed.
        if (!update.imageSize && data.imageSize) {
            data.imageSize = null;
            return;
        }

        // image size has been added.
        if (update.imageSize && !data.imageSize) {
            data.imageSize = update.imageSize;
            return;
        }

        // Image size changed.
        if (update.imageSize.height !== data.imageSize.height) {
            data.imageSize.height = update.imageSize.height;
        }
        if (update.imageSize.width !== data.imageSize.width) {
            data.imageSize.width = update.imageSize.width;
        }
    }

    updateStatus(data: ImportGridFile, update: ImportGridFile) {
        // Update the status flags.
        if (data.stepStatus.readPreImportFile !== update.stepStatus.readPreImportFile) {
            data.stepStatus.readPreImportFile = update.stepStatus.readPreImportFile;
        }
        if (data.stepStatus.gatherMetaData !== update.stepStatus.gatherMetaData) {
            data.stepStatus.gatherMetaData = update.stepStatus.gatherMetaData;
        }
        if (data.stepStatus.copyFileToImport !== update.stepStatus.copyFileToImport) {
            data.stepStatus.copyFileToImport = update.stepStatus.copyFileToImport;
        }
        if (data.stepStatus.checkFileIgnored !== update.stepStatus.checkFileIgnored) {
            data.stepStatus.checkFileIgnored = update.stepStatus.checkFileIgnored;
        }
        if (data.stepStatus.checkActivePhotoFile !== update.stepStatus.checkActivePhotoFile) {
            data.stepStatus.checkActivePhotoFile = update.stepStatus.checkActivePhotoFile;
        }
        if (data.stepStatus.checkDuplicateFile !== update.stepStatus.checkDuplicateFile) {
            data.stepStatus.checkDuplicateFile = update.stepStatus.checkDuplicateFile;
        }
        if (data.stepStatus.checkFileConfirmedImported !== update.stepStatus.checkFileConfirmedImported) {
            data.stepStatus.checkFileConfirmedImported = update.stepStatus.checkFileConfirmedImported;
        }
        if (data.stepStatus.processImport !== update.stepStatus.processImport) {
            data.stepStatus.processImport = update.stepStatus.processImport;
        }
        if (data.stepStatus.completed !== update.stepStatus.completed) {
            data.stepStatus.completed = update.stepStatus.completed;
        }
    }

    updateSimilar(data: ImportGridFile, update: ImportGridFile) {
        // if no similar files just return.
        if (!data.similarFiles && !update.similarFiles) {
            return;
        }

        // similar files have been removed has been removed.
        if (!update.similarFiles && data.similarFiles) {
            data.similarFiles = null;
            return;
        }

        // image size has been added.
        if (update.similarFiles && !data.similarFiles) {
            data.similarFiles = update.similarFiles;
            return;
        }

        // Has the number of similar files changed?
        if (update.similarFiles.length !== data.similarFiles.length) {
            data.similarFiles = update.similarFiles;
            return;
        }

        // Have any similar files been added or removed?
        let added = false;
        update.similarFiles.forEach(uf => {
            let found = false;
            data.similarFiles.forEach(f => {
                  if (uf.filename === f.filename) {
                      found = true;
                  }
            });

            if (!found) {
                added = true;
            }
        });
        if (added) {
            data.similarFiles = update.similarFiles;
            return;
        }

        let removed = false;
        data.similarFiles.forEach(f => {
            let found = false;
            update.similarFiles.forEach(uf => {
                if (f.filename === uf.filename) {
                    found = true;
                }
            });

            if (!found) {
                removed = true;
            }
        });
        if (removed) {
            data.similarFiles = update.similarFiles;
            return;
        }

        // Update the individual files.
        data.similarFiles.forEach(f => {
           update.similarFiles.forEach( uf => {
               if (f.filename === uf.filename) {
                   if (f.md5 !== uf.md5) {
                       f.md5 = uf.md5;
                   }
                   if (f.date !== uf.date) {
                       f.date = uf.date;
                   }
                   if (f.size !== uf.size) {
                       f.size = uf.size;
                   }
               }
           });
        });
    }

    updateFileData(data: ImportGridFile, update: ImportGridFile) {
        // Have the details changed?
        this.updateFileDataBase(data, update);

        if (data.destination !== update.destination) {
            data.destination = update.destination;
        }
        if (data.importName !== update.importName) {
            data.importName = update.importName;
        }
        if (data.duration !== update.duration) {
            data.duration = update.duration;
        }
        if (data.importDate !== update.importDate) {
            data.importDate = update.importDate;
        }
        if (data.importSize !== update.importSize) {
            data.importSize = update.importSize;
        }
        if (data.importMd5 !== update.importMd5) {
            data.importMd5 = update.importMd5;
        }
        if (data.errorInPostImport !== update.errorInPostImport) {
            data.errorInPostImport = update.errorInPostImport;
        }
        if (data.errorInImport !== update.errorInImport) {
            data.errorInImport = update.errorInImport;
        }
        if (data.processed !== update.processed) {
            data.processed = update.processed;
        }
        if (data.inDatabase !== update.inDatabase) {
            data.inDatabase = update.inDatabase;
        }
        if (data.inImport !== update.inImport) {
            data.inImport = update.inImport;
        }
        if (data.inPostImport !== update.inPostImport) {
            data.inPostImport = update.inPostImport;
        }
        if (data.image !== update.image) {
            data.image = update.image;
        }
        if (data.video !== update.video) {
            data.video = update.video;
        }

        this.updateLatLong(data, update);
        this.updateImageSize(data, update);
        this.updateStatus(data, update);
        this.updateSimilar(data, update);
    }

    summaryUpdate(event: MessageEvent) {
        const update: ImportGridSummaryCount = JSON.parse(event.data);
        let limit = 20;
        let page = 0;

        if (this.summary) {
            limit = this.summary.limit;
            page = this.summary.page;
        }

        this.summary = update;

        if (this.summary) {
            this.summary.limit = limit;
            this.summary.page = page;
        }

        console.log('summary ' + update.PreImport);
    }

    fileUpdate(event: MessageEvent): void {
        const update: ImportGridFile[] = JSON.parse(event.data);

        update.forEach(f => {
            let index = 0;
            this.data.forEach(d => {
                index++;
                if (!d.source) {
                    return;
                }

                if (f.filename !== d.source.filename) {
                    return;
                }

                // If the file has been removed, hide it.
                if (f.status && f.status === 'REMOVED') {
                    d.hide();
                } else {
                    this.updateFileData(d.source, f);
                }
            });
        });
    }

    selectRequestByName(filename: string) {
        this.data.forEach(f => {
           if (f.source.filename === filename) {
               // Force the update
               f.selected = false;
               this.selectRequest(f);
           }
        });
    }

    refresh(newLimit: number) {
        this.status = 'loading';
        this.data = [];
        let id = 0;
        let count = 0;
        let page = 0;
        let limit = 20;

        if (newLimit !== -1) {
            if (this.summary) {
                this.summary.limit = newLimit;
                this.summary.page = 0;
            }
        }

        if (this.summary) {
            page = this.summary.page;
            limit = this.summary.limit;
        }

        // Get the data.
        this._importGridService.getFiles(limit, page, this.filter).subscribe({
            next: val => {
                val.forEach((e) => {
                    this.data.push(new ImportGridFileDisplay(id++, e));
                    count++;
                });
                this.sortData(this.sortColumn, false);
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
                    this.afterRefresh = '';
                } else if (this.data && this.data.length > 0) {
                    // Select the first.
                    this.selectRequest(this.data[0]);
                }

                this.status = count + ' files loaded';
            }
        });
    }

    selectRequest(data: ImportGridFileDisplay) {
        // If this is already selected, then nothing to do.
        if (data.selected) {
            return;
        }

        // Make the current selected unselected.
        this.data.forEach(f => {
            if (f.selected) {
                f.selected = false;
            }
        });

        data.selected = true;
        this.selectedFile = data;
        this.selected.selectionChange(data);
    }

    nameSorter(name: ImportGridFile, importType: boolean): string {
        if (importType) {
            if (name?.importName) {
                return name.importName.toLowerCase();
            }
        } else if (name?.filename) {
            return name.filename.toLowerCase();
        }

        return '';
    }

    sortName(importType: boolean) {
        this.data.sort((f1, f2) => {
            if (this.nameSorter(f1.source, importType) > this.nameSorter(f2.source, importType)) {
                return this.sortUp ? 1 : -1;
            }

            if (this.nameSorter(f1.source, importType) < this.nameSorter(f2.source, importType)) {
                return this.sortUp ? -1 : 1;
            }

            return 0;
        });
    }

    sizeSorter(file: ImportGridFile, importType: boolean): number {
        if (file) {
            if (importType) {
                return file.importSize;
            } else {
                return file.size;
            }
        }

        return 0;
    }

    sortSize(importType: boolean) {
        this.data.sort((f1, f2) => {
            if (this.sizeSorter(f1.source, importType) > this.sizeSorter(f2.source, importType)) {
                return this.sortUp ? 1 : -1;
            }

            if (this.sizeSorter(f1.source, importType) < this.sizeSorter(f2.source, importType)) {
                return this.sortUp ? -1 : 1;
            }

            return 0;
        });
    }

    statusSorter(file: ImportGridFile): string {
        if (file) {
            let result = '';

            result += file.stepStatus.readPreImportFile;

            return result;
        }

        return '';
    }

    sortStatus() {
        this.data.sort((f1, f2) => {
            if (this.statusSorter(f1.source) > this.statusSorter(f2.source)) {
                return this.sortUp ? 1 : -1;
            }

            if (this.statusSorter(f1.source) < this.statusSorter(f2.source)) {
                return this.sortUp ? -1 : 1;
            }

            return 0;
        });
    }

    dateSorter(file: ImportGridFile, importType: boolean): string {
        if (file) {
            if (importType) {
                return file.importDate;
            } else {
                return file.date;
            }
        }

        return '';
    }

    sortDate(importType: boolean) {
        this.data.sort((f1, f2) => {
            if (this.dateSorter(f1.source, importType) > this.dateSorter(f2.source, importType)) {
                return this.sortUp ? 1 : -1;
            }

            if (this.dateSorter(f1.source, importType) < this.dateSorter(f2.source, importType)) {
                return this.sortUp ? -1 : 1;
            }

            return 0;
        });
    }

    md5Sorter(file: ImportGridFile, importType: boolean): string {
        if (file) {
            if (importType) {
                if (file.importMd5) {
                    return file.importMd5.toUpperCase();
                }
            } else if (file.md5) {
                return file.md5.toUpperCase();
            }
        }

        return '';
    }

    sortMD5(importType: boolean) {
        this.data.sort((f1, f2) => {
            if (this.md5Sorter(f1.source, importType) > this.md5Sorter(f2.source, importType)) {
                return this.sortUp ? 1 : -1;
            }

            if (this.md5Sorter(f1.source, importType) < this.md5Sorter(f2.source, importType)) {
                return this.sortUp ? -1 : 1;
            }

            return 0;
        });
    }

    sortData(column: string, flipOrder: boolean) {
        const oldStatus: string = this.status;

        if (flipOrder && column === this.sortColumn) {
            this.sortUp = !this.sortUp;
        }

        this.status = 'Sorting';
        switch (column) {
            case 'Name':
                this.sortName(false);
                break;
            case 'Size':
                this.sortSize(false);
                break;
            case 'MD5':
                this.sortMD5(false);
                break;
            case 'Date':
                this.sortDate(false);
                break;
            case 'Import Name':
                this.sortName(true);
                break;
            case 'Import Size':
                this.sortSize(true);
                break;
            case 'Import MD5':
                this.sortMD5(true);
                break;
            case 'Import Date':
                this.sortDate(true);
                break;
            case 'Status':
                this.sortStatus();
                break;
        }
        this.status = oldStatus;
        this.sortColumn = column;
    }

    deleteRejected() {
        if (this.modalRef) {
            this.modalRef.hide();
        }
        this.fileForDelete = null;
    }

    deleteConfirmed() {
        if (this.modalRef) {
            this.modalRef.hide();
        }

        if (this.fileForDelete) {
            this._importGridService.delete(this.fileForDelete).subscribe({
                next: (result) => {
                    console.log(result);
                },
                error: err => {
                    this.status = 'Delete failed - check log';
                    console.log('There is an error?' + err.message);
                },
                complete: () => {
                    console.log('Deleted file');
                    this.status = 'Delete complete.';
                    this.refresh(-1);
                }
            });
        }

        this.fileForDelete = null;
    }

    getDeleteFilename(): string {
        if (this.fileForDelete) {
            return this.fileForDelete;
        }

        return '?';
    }

    deleteAction(filename: string, template: TemplateRef<any>) {
        if (filename == null || filename === '') {
            this.fileForDelete = null;
            return;
        }

        this.fileForDelete = filename;

        this.modalRef = this.modalService.show(template, {class: 'modal-md'});
    }

    unIgnoreFile(file: string) {
        // Ignore the file.
        this.status = 'Removing the ignore flag from the file.';
        this._importGridService.unignore(file).subscribe({
                next: (result) => {
                    console.log(result);
                },
                error: err => {
                    // Error.
                    this.status = 'Un-Ignore file failed - check log.';
                    console.log('There is an error?' + err.message);
                },
                complete: () => {
                    this.status = 'File un-ignored.';
                    this.refresh(-1);
                    console.log('Unignore complete');
                }
            }
        );
    }

    ignoreFile(file: string) {
        // Ignore the file.
        this.status = 'Ignoring the file.';
        this._importGridService.ignore(file).subscribe({
                next: (result) => {
                    console.log(result);
                },
                error: err => {
                    // Error.
                    this.status = 'Ignore file failed - check log.';
                    console.log('There is an error?' + err.message);
                },
                complete: () => {
                    this.status = 'File ignored.';
                    this.refresh(-1);
                    console.log('Ignore complete');
                }
            }
        );
    }

    recipeFile(file: string) {
        // Mark the file as a recipe
        this.status = 'Marking the file as a recipe.';
        this._importGridService.recipe(file).subscribe({
                next: (result) => {
                    console.log(result);
                },
                error: err => {
                    // Error.
                    this.status = 'Failed to mark file as a recipe - check log.';
                    console.log('There is an error?' + err.message);
                },
                complete: () => {
                    this.status = 'File marked as recipe.';
                    this.nextAction(file);
                    console.log('Mark as recipe complete complete');
                }
            }
        );
    }

    backupFile(file: string) {
        // Mark the file as a backup
        this.status = 'Marking the file as a basic backup.';
        this._importGridService.backup(file).subscribe({
                next: (result) => {
                    console.log(result);
                },
                error: err => {
                    // Error.
                    this.status = 'Failed to mark file as a basic backup - check log.';
                    console.log('There is an error?' + err.message);
                },
                complete: () => {
                    this.status = 'File marked as basic backup.';
                    this.nextAction(file);
                    console.log('Mark as backup complete complete');
                }
            }
        );
    }

    updateDestination(update: FileDestinationUpdate) {
        // Mark the file as a recipe
        this.status = 'Update the destination of ' + update.filename;
        this._importGridService.updateDestination(update).subscribe({
                next: (result) => {
                    console.log(result);
                },
                error: err => {
                    // Error.
                    this.status = 'Failed to update the destination - check log.';
                    console.log('There is an error?' + err.message);
                },
                complete: () => {
                    this.status = 'Destination updated.';

                    // Update the destination on the screen.
                    this.data.forEach(f => {
                        if (f.source.filename === update.filename) {
                            f.source.destination = update.destination;
                        }
                    });

                    this.nextAction(update.filename);
                    console.log('Destination updated');
                }
            }
        );
    }

    previousAction(file: string) {
        // Select the file before
        let previous: ImportGridFileDisplay = null;
        this.data.forEach(f => {
            if (f.source.filename === file) {
                if (previous) {
                    return this.selectRequest(previous);
                } else {
                    // No previous, return the last entry.
                    this.selectRequest(this.data.at(-1));
                }
            }

            previous = f;
        });
    }

    nextAction(file: string) {
        // Select the file after
        let next = false;
        let selected = false;
        this.data.forEach(f => {
           if (next) {
               next = false;
               selected = true;
               return this.selectRequest(f);
           }

           if (f.source.filename === file) {
               next = true;
           }
        });

        // If nothing selected, select the first item.
        if (!selected) {
            if (this.data && this.data.length > 0) {
                this.selectRequest(this.data[0]);
            }
        }
    }

    action(action: ImportSelectedAction, template: TemplateRef<any>) {
        // Process the action.
        switch (action.action) {
            case 'previous':
                return this.previousAction(action.filename);
            case 'next':
                return this.nextAction(action.filename);
            case 'delete':
                return this.deleteAction(action.filename, template);
            case 'ignore':
                return this.ignoreFile(action.filename);
            case 'un-ignore':
                return this.unIgnoreFile(action.filename);
            case 'recipe':
                return this.recipeFile(action.filename);
            case 'backup':
                return this.backupFile(action.filename);
            case 'update-destination':
                return this.updateDestination(new FileDestinationUpdate(action.filename, action.parameter));
        }
    }

    removeIgnored() {
        this.status = 'Removing Ignored files from the import directory';
        this._importGridService.removeIgnored().subscribe({
            next: (result) => {
                console.log(result);
            },
            error: err => {
                // Error.
                this.status = 'Remove ignored failed - check log';
                console.log('There is an error?' + err.message);
            },
            complete: () => {
                console.log('Remove ignored complete');
                this.status = 'Remove ignored complete';
                this.refresh(-1);
            }
        });
    }

    importPhotos() {
        this.status = 'Importing the photos that have a destination.';
        this._importGridService.importPhotos().subscribe({
            next: (result) => {
                console.log(result);
            },
            error: err => {
                // Error.
                this.status = 'Import Photos failed - check log';
                console.log('There is an error?' + err.message);
            },
            complete: () => {
                console.log('Import photos completed');
                this.status = 'Import photos completed';
                this.refresh(-1);
            }
        });
    }

    removeActivePhoto() {
        this.status = 'Removing active photos';
        this._importGridService.removeActive().subscribe({
            next: (result) => {
                console.log(result);
            },
            error: err => {
                // Error.
                this.status = 'Remove active photos failed - check log';
                console.log('There is an error?' + err.message);
            },
            complete: () => {
                console.log('Remove ignored complete');
                this.status = 'Remove active photos complete';
                this.refresh(-1);
            }
        });
    }

    removeConfirmedImports() {
        this.status = 'Removing files that are confirmed imports.';
        this._importGridService.removeConfirmedImports().subscribe({
            next: (result) => {
                console.log(result);
            },
            error: err => {
                this.status = 'Remove duplicates failed - check log';
                console.log('There is an error?' + err.message);
            },
            complete: () => {
                console.log('Remove duplicates complete');
                this.status = 'Remove duplicates complete';
                this.refresh(-1);
            }
        });
    }

    filterChange(filter: ListFilterType) {
        // Update the filter.
        this.filter = filter;

        // Perform a refresh with the new filter.
        this.refresh(-1);
    }
}
