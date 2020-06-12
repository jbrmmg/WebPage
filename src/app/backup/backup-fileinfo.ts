import {Classification} from "./backup-classification";

export class FileInfo {
    id: number;
    name: string;
    fullFilename: string;
    size: number;
    date: Date;
    md5: string;
    classification: Classification;
}
