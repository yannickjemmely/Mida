import { MidaEconomicFactor } from "#factors/MidaEconomicFactor";
import { MidaSet } from "#utilities/collections/MidaSet";

// Represents a set of economic factors (based on their name).
export class MidaEconomicFactorSet extends MidaSet<MidaEconomicFactor> {
    public constructor () {
        super((factor: MidaEconomicFactor): string => {
            return factor.name;
        });
    }

    public getByCurrency (currencyID: string): MidaEconomicFactor[] {
        const matchedFactors: MidaEconomicFactor[] = [];

        for (const factor of this.valuesToArray()) {
            if (factor.influencedCurrencies.hasOwnProperty(currencyID)) {
                matchedFactors.push(factor);
            }
        }

        return matchedFactors;
    }
}
