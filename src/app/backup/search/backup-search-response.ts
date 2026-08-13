export interface BackupSearchResult {
    id: number;
    name: string;
    fullFilename: string;
    path: string;
    locationName: string;
    date: string;
    size: number;
    expiry: string;
    icon: string;
    md5: string;
    latitude: number;
    longitude: number;
    video: boolean;
    image: boolean;
}

export interface BackupSearchResponse {
    page: number;
    pageSize: number;
    totalCount: number;
    results: BackupSearchResult[];
}
