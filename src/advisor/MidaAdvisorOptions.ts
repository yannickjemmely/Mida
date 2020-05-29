import { AMidaBroker } from "#broker/AMidaBroker";
import { MidaForexPair } from "#forex/MidaForexPair";

export type MidaAdvisorOptions = {
    // Represents the broker used to operate.
    broker: AMidaBroker;

    // Represents the operated forex pair.
    forexPair: MidaForexPair;
};
