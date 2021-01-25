import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccountType } from "#brokers/MidaBrokerAccountType";

// Represents the parameters of the broker account constructor.
export type MidaBrokerAccountParameters = {
    id: string;
    fullName: string;
    type: MidaBrokerAccountType;
    broker: MidaBroker;
};
