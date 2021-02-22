import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";

/** The parameters of the broker order constructor. */
export type MidaBrokerOrderParameters = {
    ticket: number;
    brokerAccount: MidaBrokerAccount;
    creationDirectives: MidaBrokerOrderDirectives;
    requestDate: Date;
    creationDate: Date;
    openDate?: Date;
    closeDate?: Date;
    tags?: string[];
};
