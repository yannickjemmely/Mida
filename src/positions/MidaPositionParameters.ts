import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaPositionType } from "#positions/MidaPositionType";

// Represents the parameters of the position constructor.
export type MidaPositionParameters = {
    ticket: number;
    creationTime: Date;
    symbol: string;
    type: MidaPositionType;
    lots: number;
    account: MidaBrokerAccount;
    tags?: string[];
};
