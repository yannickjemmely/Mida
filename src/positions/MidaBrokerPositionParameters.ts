import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerPositionType } from "#positions/MidaBrokerPositionType";

// Represents the parameters of the broker position constructor.
export type MidaBrokerPositionParameters = {
    ticket: number;
    brokerAccount: MidaBrokerAccount;
    symbol: string;
    type: MidaBrokerPositionType;
    tags?: string[];
};
