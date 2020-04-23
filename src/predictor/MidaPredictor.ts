import { MidaEconomicFactor } from "#factors/MidaEconomicFactor";
import { MidaEconomist } from "#factors/MidaEconomist";

export class MidaPredictor {
    private constructor () {
        // Silence is golden.
    }

    public static async predictCurrencyStrengthDirection (currencyID: string): Promise<number> {
        const currencyEconomicFactors: MidaEconomicFactor[] = MidaEconomist.getEconomicFactorsByCurrency(currencyID);
        let currencyStrengthDirection: number = 0;

        for (const economicFactor of currencyEconomicFactors) {
            currencyStrengthDirection += (await economicFactor.getLatestStatement()).makeCurrencyPrediction(currencyID).strengthDirection;
        }

        return currencyStrengthDirection;
    }
}
