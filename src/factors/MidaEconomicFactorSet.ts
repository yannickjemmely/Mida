import { MidaCurrency } from "#currency/MidaCurrency";
import { MidaEconomicFactor } from "#factors/MidaEconomicFactor";
import { MidaSet } from "#utilities/collections/MidaSet";

// Represents a set of economic factors (based on their name).
export class MidaEconomicFactorSet extends MidaSet<MidaEconomicFactor> {
    public constructor () {
        super((factor: MidaEconomicFactor): string => factor.name);
    }

    public getByCurrency (currency: MidaCurrency): MidaEconomicFactor[] {
        const matchedFactors: MidaEconomicFactor[] = [];

        for (const factor of this.toArray()) {
            if (factor.influencedCurrencies.hasOwnProperty(currency.id)) {
                matchedFactors.push(factor);
            }
        }

        return matchedFactors;
    }
}
