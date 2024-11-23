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
    public static unknownAccountId: string = "UNKN";

    constructor(public id: string,
                public name: string,
                public imagePrefix: string,
                public colour: string,
                public closed: boolean) {
    }

    static unknownAccount(): JbAccount {
        if(JbAccount.unknown == null) {
            JbAccount.unknown = new JbAccount(JbAccount.unknownAccountId,"Unknown","","FFFFFF",false);
        }

        return JbAccount.unknown;
    }
}
