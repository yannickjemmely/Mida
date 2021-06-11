import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccountType } from "#brokers/MidaBrokerAccountType";

/** The parameters of the broker account constructor. */
export type MidaBrokerAccountParameters = {
    /** The account id. */
    id: string;
    /** The account owner name. */
    ownerName: string;
    /** The account type. */
    type: MidaBrokerAccountType;
    /** The account global leverage. */
    globalLeverage: number;
    /** The account currency. */
    currency: string;
    /** Indicates if the account is hedged. */
    isHedged: boolean;
    /** The account stop out level. */
    stopOutLevel: number;
    /** The account broker. */
    broker: MidaBroker;
};
