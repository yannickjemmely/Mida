import { AMidaAssetPairEventListener } from "#assets/AMidaAssetPairEventListener";
import { MidaAssetPair } from "#assets/MidaAssetPair";
import { MidaAssetPairEvent } from "#assets/MidaAssetPairEvent";
import { MidaAssetPairTick } from "#assets/MidaAssetPairTick";

export class MidaPriceBreakEventListener extends AMidaAssetPairEventListener {
    private readonly _priceToBreak: number;
    private _initialPrice: number | undefined;

    public constructor (assetPair: MidaAssetPair, priceToBreak: number, handler: (event: MidaAssetPairEvent) => void) {
        super(assetPair, handler);

        this._priceToBreak = priceToBreak;
        this._initialPrice = undefined;
    }

    protected onTick (tick: MidaAssetPairTick): void {
        // TODO: implement.
    }
}
