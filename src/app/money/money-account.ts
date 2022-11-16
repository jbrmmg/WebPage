export interface IAccount {
    id: string;
    name: string;
    imagePrefix: string;
    colour: string;
}

export class JbAccount implements IAccount {
    selected: boolean;

    constructor(public id: string,
                public name: string,
                public imagePrefix: string,
                public colour: string ) {
    }

    public static getFileType(id: string): string {
        console.log('HERE');
        switch (id) {
            case 'BANK':
                return 'FIRSTDIRECT';
            case 'AMEX':
                return 'AMEX';
            case 'JLPC':
                return 'JOHNLEWIS';
            case 'JLP2':
                return 'JOHNLEWIS2';
        }

        return 'Other';
    }
}
