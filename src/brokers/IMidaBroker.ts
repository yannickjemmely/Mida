import { IMidaBrokerAccount } from "#brokers/IMidaBrokerAccount";
import { MidaBrokerLoginParameters } from "#brokers/MidaBrokerLoginParameters";

// Represents a broker.
export interface IMidaBroker {
    readonly name: string;

    readonly websiteUri: string;

    login (parameters: MidaBrokerLoginParameters): Promise<IMidaBrokerAccount>;
}
