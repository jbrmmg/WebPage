import {Component, EventEmitter, Input, Output} from "@angular/core";
import {ImportGridSummaryCount} from "./import-grid-summary-count";
import {TrafficLightStatus, TrafficLightType} from "../traffic/import-grid-traffic-light";
import {ImportGridSummaryStepCount} from "./import-grid-summary-step-count";
import {NgForOf, NgIf} from "@angular/common";
import {ListFilterType} from "../import-grid-filter";

@Component({
    selector: 'jbr-import-grid-summary',
    templateUrl: './import-grid-summary.html',
    styleUrls: ['./import-grid-summary.css'],
    imports: [
        NgIf,
        NgForOf
    ],
    standalone: true
})
export class ImportGridSummary {
    listFilter: ListFilterType;
    @Input() summary: ImportGridSummaryCount;
    @Input() status: string;
    @Output() refreshEvent: EventEmitter<number> = new EventEmitter();
    @Output() removeConfirmedImportsEvent: EventEmitter<void> = new EventEmitter();
    @Output() removeIgnoredEvent: EventEmitter<void> = new EventEmitter();
    @Output() filterChangeEvent: EventEmitter<ListFilterType> = new EventEmitter();
    @Output() removeActivePhotosEvent: EventEmitter<void> = new EventEmitter();

    getHeaderText(status: TrafficLightStatus): string {
        switch (status) {
            case TrafficLightStatus.Green:
                return "Green";
            case TrafficLightStatus.Red:
                return "Red";
            case TrafficLightStatus.Amber:
                return "Amber";
        }

        return "Unknown";
    }

    getColumnHeaderText(step: TrafficLightType): string {
        switch(step) {
            case TrafficLightType.readPreImportFile:
                return "Read";
            case TrafficLightType.gatherMetaData:
                return "Meta";
            case TrafficLightType.copyFileToImport:
                return "Copy";
            case TrafficLightType.checkFileIgnored:
                return "Ignore";
            case TrafficLightType.checkActivePhotoFile:
                return "Active";
            case TrafficLightType.checkDuplicateFile:
                return "Duplicate";
            case TrafficLightType.checkFileConfirmedImported:
                return "Imported";
            case TrafficLightType.processImport:
                return "Process";
            case TrafficLightType.completed:
                return "Complete";
        }
    }

    getPreImportTotal(status: TrafficLightStatus): string {
        if(this.summary && this.summary.PreImport && status == TrafficLightStatus.Green) {
            return "" + this.summary.PreImport;
        }

        return " ";
    }

    getImportTotal(status: TrafficLightStatus): string {
        if(this.summary && this.summary.Import && status == TrafficLightStatus.Green) {
            return "" + this.summary.Import;
        }

        return " ";
    }

    getPostImportTotal(status: TrafficLightStatus): string {
        if(this.summary && this.summary.PostImport && status == TrafficLightStatus.Green) {
            return "" + this.summary.PostImport;
        }

        return " ";
    }

    getQueued(status: TrafficLightStatus): string {
        if(this.summary != null && status == TrafficLightStatus.Green) {
            return "" + this.summary.Queued;
        }

        return " ";
    }

    getCountForType(type: TrafficLightType): ImportGridSummaryStepCount {
        let count: ImportGridSummaryStepCount;

        switch (type) {
            case TrafficLightType.readPreImportFile:
                if(this.summary && this.summary.readPreImportFile) {
                    count = this.summary.readPreImportFile;
                }
                break;
            case TrafficLightType.gatherMetaData:
                if(this.summary && this.summary.gatherMetaData) {
                    count = this.summary.gatherMetaData;
                }
                break;
            case TrafficLightType.copyFileToImport:
                if(this.summary && this.summary.copyFileToImport) {
                    count = this.summary.copyFileToImport;
                }
                break;
            case TrafficLightType.checkFileIgnored:
                if(this.summary && this.summary.checkFileIgnored) {
                    count = this.summary.checkFileIgnored;
                }
                break;
            case TrafficLightType.checkActivePhotoFile:
                if(this.summary && this.summary.checkActivePhotoFile) {
                    count = this.summary.checkActivePhotoFile;
                }
                break;
            case TrafficLightType.checkDuplicateFile:
                if(this.summary && this.summary.checkDuplicateFile) {
                    count = this.summary.checkDuplicateFile;
                }
                break;
            case TrafficLightType.checkFileConfirmedImported:
                if(this.summary && this.summary.checkFileConfirmedImported) {
                    count = this.summary.checkFileConfirmedImported;
                }
                break;
            case TrafficLightType.processImport:
                if(this.summary && this.summary.processImport) {
                    count = this.summary.processImport;
                }
                break;
            case TrafficLightType.completed:
                if(this.summary && this.summary.completed) {
                    count = this.summary.completed;
                }
        }

        return count;
    }

    getClass(type: TrafficLightType, status: TrafficLightStatus) {
        let count: ImportGridSummaryStepCount = this.getCountForType(type);
        let baseClass: string = "";

        if(this.listFilter) {
            if(this.listFilter.type == type && this.listFilter.status == status) {
                baseClass = " filter";
            }
        }

        if(count != null) {
            switch(status) {
                case TrafficLightStatus.Unknown:
                    if(count.UNKNOWN > 0) {
                        return "unknown" + baseClass;
                    }
                    break;
                case TrafficLightStatus.Amber:
                    if(count.AMBER > 0) {
                        return "amber" + baseClass;
                    }
                    break;
                case TrafficLightStatus.Red:
                    if(count.RED > 0) {
                        return "red" + baseClass;
                    }
                    break;
                case TrafficLightStatus.Green:
                    if(count.GREEN > 0) {
                        return "green" + baseClass;
                    }
                    break;
            }
        }

        return "ok";
    }

    displayStatus(status: TrafficLightStatus): boolean {
        if(this.summary == null) {
            return false;
        }

        switch(status) {
            case TrafficLightStatus.Unknown:
                return this.summary.copyFileToImport.UNKNOWN > 0 ||
                    this.summary.processImport.UNKNOWN > 0 ||
                    this.summary.readPreImportFile.UNKNOWN > 0 ||
                    this.summary.completed.UNKNOWN > 0 ||
                    this.summary.checkFileConfirmedImported.UNKNOWN > 0 ||
                    this.summary.gatherMetaData.UNKNOWN > 0 ||
                    this.summary.checkFileIgnored.UNKNOWN > 0 ||
                    this.summary.checkActivePhotoFile.UNKNOWN > 0 ||
                    this.summary.checkDuplicateFile.UNKNOWN > 0 ||
                    this.summary.copyFileToImport.UNKNOWN > 0 ||
                    this.summary.copyFileToImport.UNKNOWN > 0;

            case TrafficLightStatus.Red:
                return this.summary.copyFileToImport.RED > 0 ||
                    this.summary.processImport.RED > 0 ||
                    this.summary.readPreImportFile.RED > 0 ||
                    this.summary.completed.RED > 0 ||
                    this.summary.checkFileConfirmedImported.RED > 0 ||
                    this.summary.gatherMetaData.RED > 0 ||
                    this.summary.checkFileIgnored.RED > 0 ||
                    this.summary.checkActivePhotoFile.RED > 0 ||
                    this.summary.checkDuplicateFile.RED > 0 ||
                    this.summary.copyFileToImport.RED > 0 ||
                    this.summary.copyFileToImport.RED > 0;

            case TrafficLightStatus.Amber:
                return this.summary.copyFileToImport.AMBER > 0 ||
                    this.summary.processImport.AMBER > 0 ||
                    this.summary.readPreImportFile.AMBER > 0 ||
                    this.summary.completed.AMBER > 0 ||
                    this.summary.checkFileConfirmedImported.AMBER > 0 ||
                    this.summary.gatherMetaData.AMBER > 0 ||
                    this.summary.checkFileIgnored.AMBER > 0 ||
                    this.summary.checkActivePhotoFile.AMBER > 0 ||
                    this.summary.checkDuplicateFile.AMBER > 0 ||
                    this.summary.copyFileToImport.AMBER > 0 ||
                    this.summary.copyFileToImport.AMBER > 0;
        }

        return true;
    }

    refresh() {
        this.refreshEvent.emit(-1);
    }

    removeIgnored() {
        this.removeIgnoredEvent.emit();
    }

    removeConfirmedImports() {
        this.removeConfirmedImportsEvent.emit();
    }

    removeActivePhotos() {
        this.removeActivePhotosEvent.emit();
    }

    importFiles() {

    }

    setPageSize(size: number) {
        this.refreshEvent.emit(size);
    }

    getTotal(type: TrafficLightType, status: TrafficLightStatus) {
        let count: ImportGridSummaryStepCount = this.getCountForType(type);

        if(count != null) {
            switch(status) {
                case TrafficLightStatus.Unknown:
                    if(count.UNKNOWN > 0) {
                        return "" + count.UNKNOWN;
                    }
                    break;
                case TrafficLightStatus.Amber:
                    if(count.AMBER > 0) {
                        return "" + count.AMBER;
                    }
                    break;
                case TrafficLightStatus.Red:
                    if(count.RED > 0) {
                        return "" + count.RED;
                    }
                    break;
                case TrafficLightStatus.Green:
                    if(count.GREEN > 0) {
                        return "" + count.GREEN;
                    }
                    break;
            }
        }

        return " ";
    }

    filter(type: TrafficLightType, status: TrafficLightStatus) {
        let oldFilter: ListFilterType = this.listFilter;
        this.listFilter = null;

        let count: ImportGridSummaryStepCount = this.getCountForType(type);
        let statusCount: number = 0;

        if(count != null) {
            switch(status) {
                case TrafficLightStatus.Unknown:
                    statusCount = count.UNKNOWN;
                    break;
                case TrafficLightStatus.Amber:
                    statusCount = count.AMBER;
                    break;
                case TrafficLightStatus.Red:
                    statusCount = count.RED;
                    break;
                case TrafficLightStatus.Green:
                    statusCount = count.GREEN;
                    break;
            }
        }

        if(statusCount > 0) {
            this.listFilter = new ListFilterType();
            this.listFilter.type = type;
            this.listFilter.status = status;
        }

        // Has the filter been changed?
        let changed: boolean = false;
        if(oldFilter == null && this.listFilter != null) {
            changed = true;
        } else if (oldFilter != null && this.listFilter == null) {
            changed = true;
        } else if (oldFilter != null && this.listFilter != null) {
            if(oldFilter.type != this.listFilter.type) {
                changed = true;
            } else if (oldFilter.status != this.listFilter.status) {
                changed = true;
            }
        }

        // If changed, fire the filter change event.
        if(changed) {
            this.filterChangeEvent.emit(this.listFilter);
        }
    }

    getSteps(): number[] {
        let result: number[] = [];

        for(let step in TrafficLightType) {
            if(!isNaN(Number(step))) {
                result.push(Number(step));
            }
        }

        return result;
    }

    getStatus(): number[] {
        let result: number[] = [];

        for(let step in TrafficLightStatus) {
            if(!isNaN(Number(step))) {
                result.unshift(Number(step));
            }
        }

        return result;
    }

    protected readonly TrafficLightType = TrafficLightType;
    protected readonly TrafficLightStatus = TrafficLightStatus;
}
