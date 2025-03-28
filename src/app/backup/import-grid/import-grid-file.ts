import {IImportGridFileBase} from "./import-grid-file-base";
import {LatLong} from "./import-grid-latlong";
import {ImageSize} from "./import-grid-imagesize";
import {StepStatusType} from "./traffic/import-grid-traffic-light";

export class ImportGridFile implements IImportGridFileBase {
    filename: string;
    date: string;
    size: number;
    md5: string;
    status: string;
    duration: number;
    destination: string;
    importName: string;
    importDate: string;
    importSize: number;
    importMd5: string;
    similarFiles: IImportGridFileBase[];
    errorInPostImport: boolean;
    errorInImport: boolean;
    processed: boolean;
    inDatabase: boolean;
    inImport: boolean;
    inPostImport: boolean;
    location: LatLong;
    imageSize: ImageSize;
    image: boolean;
    video: boolean;
    stepStatus: StepStatusType;
}
