import { MidaEconomicFactor } from "#factors/MidaEconomicFactor";
import { MidaEconomicFactorStatementCurrencyPrediction } from "#factors/MidaEconomicFactorStatementCurrencyPrediction";
import { MidaUtilities } from "#utilities/MidaUtilities";

// Represents the statement of an economic factor.
export type MidaEconomicFactorStatement = {
    // Represents a reference to the factor.
    factor: MidaEconomicFactor;

    // Represents the time of the statement.
    time: Date;

    // Represents the time of the next statement.
    nextStatementTime?: Date;

    // Represents the actual value of the factor.
    actual: number;

    // Represents the forecast value that has been made on the actual value.
    forecast?: number;

    // Represents the actual value of the previous statement.
    previous: number;

    // Represents the distance (in percentage) between the actual value and the forecast value.
    // In case the forecast value is not present then the distance is between the actual value and the previous value.
    actualDistance: number;

    // Used to predict what this statement implies for a currency at this day.
    makeCurrencyPrediction (currencyId: string): MidaEconomicFactorStatementCurrencyPrediction;
};

export function getCurrencyStrengthDirection (currencyId: string, statement: MidaEconomicFactorStatement, positiveBearish: boolean): number {
    const influence: number = statement.factor.influencedCurrencies[currencyId] || 0;
    const elapsedTime: number = 1 / Math.exp(MidaUtilities.getDaysBetweenDates(new Date(), statement.time));
    const direction: number = statement.actualDistance * (Math.exp(Math.sqrt(influence)) - 1) * elapsedTime;

    if (positiveBearish) {
        return -direction;
    }

    return direction;
}
