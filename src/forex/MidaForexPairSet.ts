import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaSet } from "#utilities/collections/MidaSet";

export class MidaForexPairSet extends MidaSet<MidaForexPair> {
    public constructor (forexPairs?: MidaForexPair[]) {
        super((forexPair: MidaForexPair): string => forexPair.ID, forexPairs);
    }
}
