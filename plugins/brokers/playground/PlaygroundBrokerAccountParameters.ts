import { MidaBrokerAccountParameters } from "#brokers/MidaBrokerAccountParameters";

export type PlaygroundBrokerAccountParameters = MidaBrokerAccountParameters & {
    currency: string;
};
