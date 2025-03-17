import {IImportGridFileBase} from "./import-grid-file-base";
import {LatLong} from "./import-grid-latlong";
import {ImageSize} from "./import-grid-imagesize";

export class ImportGridFile implements IImportGridFileBase {
    filename: string;
    date: string;
    size: number;
    md5: string;
    similarFiles: IImportGridFileBase[];
    ignored: string;
    imported: string;
    immediateImported: string;
    duplicated: string;
    id: number;
    status: string;
    location: LatLong;
    imageSize: ImageSize;
    image: boolean;
    video: boolean;
}
