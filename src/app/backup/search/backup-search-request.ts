export interface BackupSearchLocation {
    south: number;
    west: number;
    north: number;
    east: number;
}

export interface BackupSearchRequest {
    page: number;
    pageSize: number;
    filename?: string;
    dateFrom?: string;
    dateTo?: string;
    sizeMin?: number;
    sizeMax?: number;
    expiryFrom?: string;
    expiryTo?: string;
    labels?: string[];
    location?: BackupSearchLocation;
}
