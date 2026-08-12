import {BackupLocation} from './backup-location';

export class BackupSource {
    id: number;
    path: string;
    location: BackupLocation;
    status: string;
    filter: string;
    type: string;
    primary: boolean;
    group: string;
    destinationId: number;
    directoryCount: number;
    fileCount: number;
    totalFileSize: bigint;
    largestFile: bigint;
    gatherMetaData: boolean;
    syncStartTime: string;
    syncEndTime: string;
    syncFilesCopied: number;
    syncDirectoriesCopied: number;
    syncFilesDeleted: number;
    syncDirectoriesDeleted: number;
    syncSourcesRemoved: number;
    syncDatesUpdated: number;
    syncFilesWarned: number;
}
