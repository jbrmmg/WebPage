/*
 * Equivalent of AccountDTO
 */

export interface IAccount {
    id: string;
    name: string;
    imagePrefix: string;
    colour: string;
    closed: boolean;
}

export class JbAccount implements IAccount {
    selected: boolean;
    private static unknown: JbAccount;
    public static readonly unknownAccountId: string = "UNKN";

    constructor(public id: string,
                public name: string,
                public imagePrefix: string,
                public colour: string,
                public closed: boolean) {
    }

    static unknownAccount(): JbAccount {
        JbAccount.unknown ??= new JbAccount(JbAccount.unknownAccountId,"Unknown","","FFFFFF",false);

        return JbAccount.unknown;
    }
}
