import {ImportGridFile} from '../import-grid-file';

export class StepStatusType {
    readPreImportFile: string;
    gatherMetaData: string;
    copyFileToImport: string;
    checkFileIgnored: string;
    checkActivePhotoFile: string;
    checkDuplicateFile: string;
    checkFileConfirmedImported: string;
    processImport: string;
    completed: string;
}

export enum TrafficLightType {
    readPreImportFile,
    gatherMetaData,
    copyFileToImport,
    checkFileIgnored,
    checkActivePhotoFile,
    checkDuplicateFile,
    checkFileConfirmedImported,
    processImport,
    completed
}

export enum TrafficLightStatus {
    Unknown,
    Red,
    Amber,
    Green
}

export class ImportGridTrafficLight {
    static getTrafficLightStatus(file: ImportGridFile, type: TrafficLightType): TrafficLightStatus {
        let status = 'UNKNOWN';

        // Get the type.
        switch (type) {
            case TrafficLightType.readPreImportFile:
                status = file.stepStatus.readPreImportFile;
                break;
            case TrafficLightType.gatherMetaData:
                status = file.stepStatus.gatherMetaData;
                break;
            case TrafficLightType.copyFileToImport:
                status = file.stepStatus.copyFileToImport;
                break;
            case TrafficLightType.checkFileIgnored:
                status = file.stepStatus.checkFileIgnored;
                break;
            case TrafficLightType.checkActivePhotoFile:
                status = file.stepStatus.checkActivePhotoFile;
                break;
            case TrafficLightType.checkDuplicateFile:
                status = file.stepStatus.checkDuplicateFile;
                break;
            case TrafficLightType.checkFileConfirmedImported:
                status = file.stepStatus.checkFileConfirmedImported;
                break;
            case TrafficLightType.processImport:
                status = file.stepStatus.processImport;
                break;
            case TrafficLightType.completed:
                status = file.stepStatus.completed;
                break;
        }

        // Convert the string value to a status.
        switch (status) {
            case 'RED':
                return TrafficLightStatus.Red;
            case 'AMBER':
                return TrafficLightStatus.Amber;
            case 'GREEN':
                return TrafficLightStatus.Green;
        }
    }

    static getHeaderTitle(type: TrafficLightType): string {
        switch (type) {
            case TrafficLightType.readPreImportFile:
                return 'Read pre-import file.';
            case TrafficLightType.gatherMetaData:
                return 'Gather meta data.';
            case TrafficLightType.copyFileToImport:
                return 'Copy file to import.';
            case TrafficLightType.checkFileIgnored:
                return 'Check file is ignored.';
            case TrafficLightType.checkActivePhotoFile:
                return 'Check if this is an active photo.';
            case TrafficLightType.checkDuplicateFile:
                return 'Check for duplicate.';
            case TrafficLightType.checkFileConfirmedImported:
                return 'Check file is confirmed as imported.';
            case TrafficLightType.processImport:
                return 'Import has been processed.';
            case TrafficLightType.completed:
                return 'All processing complete.';
        }
    }
}

export class ImportGridTrafficLightFilter {
    type: TrafficLightType;
    red = true;
    amber = true;
    green = true;
    unknown = true;

    constructor() {
    }
}
