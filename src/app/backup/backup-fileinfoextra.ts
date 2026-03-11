import {FileInfo} from './backup-fileinfo';
import {MetaData} from './backup-file-metadata';

export class FileInfoExtra {
    file: FileInfo;
    metaData: MetaData;
    backups: FileInfo[];
    labels: string[];
}
