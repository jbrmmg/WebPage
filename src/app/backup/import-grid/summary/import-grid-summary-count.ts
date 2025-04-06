import {ImportGridSummaryStepCount} from "./import-grid-summary-step-count";

export class ImportGridSummaryCount {
    PreImport: number;
    Import: number;
    PostImport: number;
    Queued: number;
    limit: number;
    page: number;
    copyFileToImport: ImportGridSummaryStepCount;
    processImport: ImportGridSummaryStepCount;
    readPreImportFile: ImportGridSummaryStepCount;
    completed: ImportGridSummaryStepCount;
    checkFileConfirmedImported: ImportGridSummaryStepCount;
    gatherMetaData: ImportGridSummaryStepCount;
    checkFileIgnored: ImportGridSummaryStepCount;
    checkActivePhotoFile: ImportGridSummaryStepCount;
    checkDuplicateFile: ImportGridSummaryStepCount;
}
