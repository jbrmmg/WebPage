import {ImportGridFile} from "../import-grid-file";

export enum TrafficLightType {
    ImmediateImportStatus,
    IgnoreStatus,
    ImportStatus,
    DuplicateStatus
}

export enum TrafficLightStatus {
    Unknown,
    Red,
    Amber,
    Green
}

export class ImportGridTrafficLight {
    static getTrafficLightStatus(file: ImportGridFile, type: TrafficLightType): TrafficLightStatus {
        let status: string = "TL_UNKNOWN";

        // Get the type.
        switch (type) {
            case TrafficLightType.ImmediateImportStatus:
                status = file.immediateImported;
                break;
            case TrafficLightType.IgnoreStatus:
                status = file.ignored;
                break;
            case TrafficLightType.ImportStatus:
                status = file.imported;
                break;
            case TrafficLightType.DuplicateStatus:
                status = file.duplicated;
                break;
        }

        // Convert the string value to a status.
        switch (status) {
            case "TL_RED":
                return TrafficLightStatus.Red;
            case "TL_AMBER":
                return TrafficLightStatus.Amber;
            case "TL_GREEN":
                return TrafficLightStatus.Green;
        }
    }

    static getShortHeaderTitle(type: TrafficLightType): string {
        switch (type) {
            case TrafficLightType.ImmediateImportStatus:
                return "Immediate";
            case TrafficLightType.IgnoreStatus:
                return "Ignore";
            case TrafficLightType.ImportStatus:
                return "Import";
            case TrafficLightType.DuplicateStatus:
                return "Duplicate";
        }
    }

    static getHeaderTitle(type: TrafficLightType): string {
        switch (type) {
            case TrafficLightType.ImmediateImportStatus:
                return "Immediate Import Status";
            case TrafficLightType.IgnoreStatus:
                return "Ignore Status";
            case TrafficLightType.ImportStatus:
                return "Import Status";
            case TrafficLightType.DuplicateStatus:
                return "Duplicate Status";
        }
    }
}

export class ImportGridTrafficLightFilter {
    type: TrafficLightType;
    red: boolean;
    amber: boolean;
    green: boolean;
    unknown: boolean;

    constructor() {
        this.red = true;
        this.amber = true;
        this.green = true;
        this.unknown = true;
    }
}
