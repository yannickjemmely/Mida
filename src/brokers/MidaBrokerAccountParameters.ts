import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccountType } from "#brokers/MidaBrokerAccountType";

// Represents the parameters of the broker account constructor.
export type MidaBrokerAccountParameters = {
    id: string;
    broker: MidaBroker;
    type: MidaBrokerAccountType;
    fullName: string;
};
