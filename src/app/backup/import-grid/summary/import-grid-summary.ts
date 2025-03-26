import {Component, Input} from "@angular/core";
import {ImportGridSummaryCount} from "./import-grid-summary-count";
import {TrafficLightStatus, TrafficLightType} from "../traffic/import-grid-traffic-light";
import {ImportGridSummaryStepCount} from "./import-grid-summary-step-count";
import {NgIf} from "@angular/common";

@Component({
    selector: 'jbr-import-grid-summary',
    templateUrl: './import-grid-summary.html',
    styleUrls: ['./import-grid-summary.css'],
    imports: [
        NgIf
    ],
    standalone: true
})
export class ImportGridSummary {
    @Input() summary: ImportGridSummaryCount;

    getPreImportTotal(): string {
        if(this.summary && this.summary.PreImport) {
            return "" + this.summary.PreImport;
        }

        return " ";
    }

    getImportTotal(): string {
        if(this.summary && this.summary.Import) {
            return "" + this.summary.Import;
        }

        return " ";
    }

    getPostImportTotal(): string {
        if(this.summary && this.summary.PostImport) {
            return "" + this.summary.PostImport;
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

        if(count != null) {
            switch(status) {
                case TrafficLightStatus.Unknown:
                    if(count.UNKNOWN > 0) {
                        return "unknown";
                    }
                    break;
                case TrafficLightStatus.Amber:
                    if(count.AMBER > 0) {
                        return "amber";
                    }
                    break;
                case TrafficLightStatus.Red:
                    if(count.RED > 0) {
                        return "red";
                    }
                    break;
                case TrafficLightStatus.Green:
                    if(count.GREEN > 0) {
                        return "green";
                    }
                    break;
            }
        }

        return "ok";
    }

    displayGreen(): boolean {
        if(this.summary == null) {
            return false;
        }

        // Are there any green counts?
        return this.summary.copyFileToImport.GREEN > 0 ||
            this.summary.processImport.GREEN > 0 ||
            this.summary.readPreImportFile.GREEN > 0 ||
            this.summary.completed.GREEN > 0 ||
            this.summary.checkFileConfirmedImported.GREEN > 0 ||
            this.summary.gatherMetaData.GREEN > 0 ||
            this.summary.checkFileIgnored.GREEN > 0 ||
            this.summary.checkActivePhotoFile.GREEN > 0 ||
            this.summary.checkDuplicateFile.GREEN > 0 ||
            this.summary.copyFileToImport.GREEN > 0 ||
            this.summary.copyFileToImport.GREEN > 0;
    }

    displayAmber(): boolean {
        if(this.summary == null) {
            return false;
        }

        // Are there any green counts?
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

    displayRed(): boolean {
        if(this.summary == null) {
            return false;
        }

        // Are there any green counts?
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
    }

    displayUnknown(): boolean {
        if(this.summary == null) {
            return false;
        }

        // Are there any green counts?
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

    protected readonly TrafficLightType = TrafficLightType;
    protected readonly TrafficLightStatus = TrafficLightStatus;
}
