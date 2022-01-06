import {BackupLocation} from "./backup-location";

export class BackupSource {
    id: number;
    path: string;
    location: BackupLocation;
    status: string;
    filter: string;
    type: string;
    destinationId: number;
    directoryCount: number;
    fileCount: number;
    totalFileSize: bigint;
    largestFile: bigint;
}
