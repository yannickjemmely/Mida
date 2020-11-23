import { MidaEvent } from "#events/MidaEvent";
import { MidaAssetPair } from "#assets/MidaAssetPair";
import { MidaAssetPairTick } from "#assets/MidaAssetPairTick";

// Represents an asset pair event.
export class MidaAssetPairEvent extends MidaEvent {
    // Represents the event asset pair.
    private readonly _assetPair: MidaAssetPair;

    // Represents the asset pair last tick when the event occurred.
    private readonly _tick: MidaAssetPairTick;

    public constructor (assetPair: MidaAssetPair, tick: MidaAssetPairTick, type: string, time: Date, details: any = {}) {
        super(type, time, details);

        this._assetPair = assetPair;
        this._tick = tick;
    }

    public get assetPair (): MidaAssetPair {
        return this._assetPair;
    }

    public get tick (): MidaAssetPairTick {
        return this._tick;
    }
}
