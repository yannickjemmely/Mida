import { MidaEconomicFactorStatement } from "#factors/MidaEconomicFactorStatement";

// Represents an economic factor.
export type MidaEconomicFactor = {
    // Represents the name of the factor.
    name: string;

    // Represents a description of the factor.
    description?: string;

    // Represents a set of currencies that may be influenced by this factor (currency ids) and
    // the respective influence this factor may have on their volatility (a number between 0 and 10).
    influencedCurrencies: {
        [currencyId: string]: number;
    };

    // Used to get the latest factor statement.
    getLatestStatement (): Promise<MidaEconomicFactorStatement>;

    // Used to get the previous factor statement.
    // getPreviousStatement (): Promise<MidaEconomicFactorStatement>;
};
