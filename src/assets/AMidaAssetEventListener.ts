import { MidaAsset } from "#assets/MidaAsset";
import { MidaAssetEvent } from "#assets/MidaAssetEvent";
import { MidaAssetTick } from "#assets/MidaAssetTick";

// Represents an asset event listener.
export abstract class AMidaAssetEventListener {
    // Represents the event listener asset.
    private readonly _asset: MidaAsset;

    // Represents the event handler.
    private readonly _handler: (event: MidaAssetEvent) => void;

    // Represents the captured ticks.
    private readonly _ticks: MidaAssetTick[];

    protected constructor (asset: MidaAsset, handler: (event: MidaAssetEvent) => void) {
        this._asset = asset;
        this._handler = handler;
        this._ticks = [];
    }

    public get asset (): MidaAsset {
        return this._asset;
    }

    protected get ticks (): readonly MidaAssetTick[] {
        return this._ticks;
    }

    protected notifyHandler (event: MidaAssetEvent): void {
        this._handler(event);
    }

    protected abstract onTick (tick: MidaAssetTick): void;
}
