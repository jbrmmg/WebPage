export class MoneyCatFilterEntry {
    percentage: number;
    colour: string;

    getStrokeDashArray() : string {
        return "calc(" + this.percentage + " * 31.42 / 100) 31.42";
    }

    constructor(percentage: number, colour: string) {
        this.percentage = percentage;
        this.colour = colour;
    }
}
