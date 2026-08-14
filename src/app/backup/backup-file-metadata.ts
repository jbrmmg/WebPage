export class MetaData {
    image: boolean;
    imageHeight: number;
    imageWidth: number;
    latitude: number;
    longitude: number;
    video: boolean;
    duration: number;
    date: Date;
    customMetaData?: { [key: string]: unknown };
}
