import { MidaBroker } from "#brokers/MidaBroker";

export type MidaPluginActions = {
    addBroker (broker: MidaBroker): void;
};
