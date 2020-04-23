import { MidaSet } from "#utilities/collections/MidaSet";
import { MidaCurrency } from "#currency/MidaCurrency";

// Represents a set of currency (based on their id).
export class MidaCurrencySet extends MidaSet<MidaCurrency> {
    public constructor () {
        super((currency: MidaCurrency): string => {
            return currency.id;
        });
    }
}
