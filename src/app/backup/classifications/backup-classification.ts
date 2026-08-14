export interface BackupClassification {
    id: number;
    order: number;
    regex: string;
    action: string;
    icon: string;
    isImage: boolean;
    isVideo: boolean;
    imageTransformer: string | null;
    checkMetaData: boolean;
    isBrowser: boolean;
}
