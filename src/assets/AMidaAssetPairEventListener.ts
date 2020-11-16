import { MidaAssetPair } from "#assets/MidaAssetPair";
import { MidaAssetPairEvent } from "#assets/MidaAssetPairEvent";
import { MidaAssetPairTick } from "#assets/MidaAssetPairTick";

// Represents an asset pair event listener.
export abstract class AMidaAssetPairEventListener {
    // Represents the event listener asset pair.
    private readonly _assetPair: MidaAssetPair;

    // Represents the event handler.
    private readonly _handler: (event: MidaAssetPairEvent) => void;

    // Represents the captured ticks.
    private readonly _ticks: MidaAssetPairTick[];

    protected constructor (assetPair: MidaAssetPair, handler: (event: MidaAssetPairEvent) => void) {
        this._assetPair = assetPair;
        this._handler = handler;
        this._ticks = [];
    }

    public get assetPair (): MidaAssetPair {
        return this._assetPair;
    }

    protected get ticks (): readonly MidaAssetPairTick[] {
        return this._ticks;
    }

    public update (tick: MidaAssetPairTick): void {
        this._ticks.push(tick);
        this.onTick(tick);
    }

    protected abstract onTick (tick: MidaAssetPairTick): void;

    protected notifyHandler (event: MidaAssetPairEvent): void {
        this._handler(event);
    }
}
