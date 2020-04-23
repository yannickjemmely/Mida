import { MidaEconomicFactorStatement } from "#factors/MidaEconomicFactorStatement";

// Represents an economic factor that may influence one or more currency.
export type MidaEconomicFactor = {
    // Represents the name of the factor.
    name: string;

    // Represents a description of the factor.
    description?: string;

    // Represents a set of influenced currency (currency ids) and
    // the respective influence that this factor has on them (a number between 0 and 10).
    influencedCurrencies: {
        [currencyID: string]: number;
    };

    // Used to get the latest factor statement.
    getLatestStatement (): Promise<MidaEconomicFactorStatement>;
};
