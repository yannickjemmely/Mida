import { MidaCurrency } from "#currency/MidaCurrency";
import { MidaSet } from "#utilities/collections/MidaSet";

// Represents a set of currency (based on their ID).
export class MidaCurrencySet extends MidaSet<MidaCurrency> {
    public constructor () {
        super((currency: MidaCurrency): string => currency.ID);
    }
}
