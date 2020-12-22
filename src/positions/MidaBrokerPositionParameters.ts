import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerPositionType } from "#positions/MidaBrokerPositionType";

// Represents the parameters of the position constructor.
export type MidaBrokerPositionParameters = {
    ticket: number;
    creationTime: Date;
    symbol: string;
    type: MidaBrokerPositionType;
    lots: number;
    account: MidaBrokerAccount;
    tags?: string[];
};
