import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";

export type MidaBrokerOrderParameters = {
    id: string;
    brokerAccount: MidaBrokerAccount;
    directives: MidaBrokerOrderDirectives;
};
