import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";

/** The parameters of the broker order constructor. */
export type MidaBrokerOrderParameters = {
    ticket: number;
    brokerAccount: MidaBrokerAccount;
    requestDirectives: MidaBrokerOrderDirectives;
    requestDate: Date;
    creationDate: Date;
    cancelDate?: Date;
    openDate?: Date;
    closeDate?: Date;
    creationPrice: number;
    cancelPrice?: number;
    openPrice?: number;
    closePrice?: number;
    tags?: string[];
};
