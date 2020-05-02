import { MidaSet } from "#utilities/collections/MidaSet";
import { MidaForexPair } from "#forex/MidaForexPair";

export class MidaForexPairSet extends MidaSet<MidaForexPair> {
    public constructor () {
        super((forexPair: MidaForexPair): string => {
            return forexPair.ID;
        });
    }
}
