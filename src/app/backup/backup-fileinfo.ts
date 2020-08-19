import {Classification} from './backup-classification';
import {DirectoryInfo} from './backup-directoryinfo';

export class FileInfo {
    id: number;
    name: string;
    fullFilename: string;
    size: number;
    date: Date;
    md5: string;
    classification: Classification;
    directoryInfo: DirectoryInfo;
}
