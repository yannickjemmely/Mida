import { MidaCurrency } from "#currency/MidaCurrency";
import { MidaEconomicFactorStatement } from "#factors/MidaEconomicFactorStatement";

// Represents the prediction of an economic factor statement on a currency.
export type MidaEconomicFactorStatementCurrencyPrediction = {
    // Represents a reference to the economic factor statement.
    statement: MidaEconomicFactorStatement;

    // Represents the time of the prediction.
    date: Date;

    // Represents a reference to the currency.
    currency: MidaCurrency;

    // Represents the predicted currency strength direction.
    // The value indicates how much the strength of the currency may change.
    // In case the value is positive then the strength may go up.
    // In case the value is negative then the strength may go down.
    strengthDirection: number;
};
