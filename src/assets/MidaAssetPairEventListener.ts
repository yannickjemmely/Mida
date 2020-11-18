import { MidaAssetPair } from "#assets/MidaAssetPair";
import { MidaAssetPairEvent } from "#assets/MidaAssetPairEvent";
import { MidaAssetPairTick } from "#assets/MidaAssetPairTick";

// Represents an asset pair event listener.
export abstract class MidaAssetPairEventListener {
    // Represents the event listener asset pair.
    private readonly _assetPair: MidaAssetPair;

    // Represents the event handler.
    private readonly _handler: (event: MidaAssetPairEvent) => void;

    // Indicates if the listener is enabled.
    private _enabled: boolean;

    // Represents the captured ticks.
    private readonly _ticks: MidaAssetPairTick[];

    protected constructor (assetPair: MidaAssetPair, handler: (event: MidaAssetPairEvent) => void) {
        this._assetPair = assetPair;
        this._handler = handler;
        this._enabled = true;
        this._ticks = [];
    }

    public get assetPair (): MidaAssetPair {
        return this._assetPair;
    }

    public get enabled (): boolean {
        return this._enabled;
    }

    public set enabled (value: boolean) {
        this._enabled = value;
    }

    protected get ticks (): readonly MidaAssetPairTick[] {
        return this._ticks;
    }

    public update (tick: MidaAssetPairTick): void {
        this._ticks.push(tick);

        if (this._enabled) {
            this.onTick(tick);
        }
    }

    protected abstract onTick (tick: MidaAssetPairTick): void;

    protected notifyHandler (event: MidaAssetPairEvent): void {
        this._handler(event);
    }
}
