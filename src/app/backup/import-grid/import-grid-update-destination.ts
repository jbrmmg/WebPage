export class FileDestinationUpdate {
    filename: string;
    destination: string;

    constructor(filename: string, destination: string) {
        this.filename = filename;
        this.destination = destination;
    }
}
