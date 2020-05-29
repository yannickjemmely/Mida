import { MidaCurrency } from "#currency/MidaCurrency";
import { MidaSet } from "#utilities/collections/MidaSet";

// Represents a set of currencies (based on their ID).
export class MidaCurrencySet extends MidaSet<MidaCurrency> {
    public constructor (currencies?: MidaCurrency[]) {
        super((currency: MidaCurrency): string => currency.ID, currencies);
    }
}
