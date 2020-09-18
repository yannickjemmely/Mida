import { AMidaBroker } from "#broker/AMidaBroker";
import { MidaForexPair } from "#forex/MidaForexPair";

export type MidaAdvisorOptions = {
    // Represents the broker used to operate.
    broker: AMidaBroker;

    // Represents the operated forex pair.
    forexPair: MidaForexPair;

    // Indicates if the advisors must be operative immediately after being instantiated.
    operative?: boolean;

    // Indicates if the advisor is being backtested.
    isTest?: boolean;

    // Represents the pips to risk.
    riskPips?: number;

    // Represents the pips to profit.
    profitPips?: number;

    // Represents the risk multiplier.
    riskMultiplier?: number;

    // Represents the profit multiplier.
    profitMultiplier?: number;

    maxSpreadPips?: number;

    onlySignals?: boolean;
};
