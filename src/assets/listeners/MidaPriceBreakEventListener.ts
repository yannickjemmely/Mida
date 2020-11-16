import { AMidaAssetPairEventListener } from "#assets/AMidaAssetPairEventListener";
import { MidaAssetPair } from "#assets/MidaAssetPair";
import { MidaAssetPairEvent } from "#assets/MidaAssetPairEvent";
import { MidaAssetPairTick } from "#assets/MidaAssetPairTick";

// Represents the listener of an asset pair quotation price break.
export class MidaPriceBreakEventListener extends AMidaAssetPairEventListener {
    // Represents the price to break.
    private readonly _priceToBreak: number;

    // Represents the initial price.
    private _initialPrice: number | undefined;

    public constructor (assetPair: MidaAssetPair, priceToBreak: number, handler: (event: MidaAssetPairEvent) => void) {
        super(assetPair, handler);

        this._priceToBreak = priceToBreak;
        this._initialPrice = undefined;
    }

    protected onTick (tick: MidaAssetPairTick): void {
        if (this._initialPrice === undefined) {
            this._initialPrice = tick.bid;

            return;
        }

        const currentPrice: number = tick.bid;
        const priceToBreak: number = this._priceToBreak;
        const initialPrice: number = this._initialPrice;

        if (initialPrice > priceToBreak && currentPrice < priceToBreak) {
            // Break from top.
        }
        else if (initialPrice < priceToBreak && currentPrice > priceToBreak) {
            // Break from bottom.
        }
    }
}
