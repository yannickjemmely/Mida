import { MidaAssetPair } from "#assets/MidaAssetPair";
import { MidaAssetPairQuotation } from "#assets/MidaAssetPairQuotation";
import { IMidaClonable } from "#utilities/IMidaClonable";
import { IMidaEquatable } from "#utilities/IMidaEquatable";

// Represents an asset pair tick.
export class MidaAssetPairTick implements IMidaEquatable, IMidaClonable<MidaAssetPairTick> {
    // Represents the tick quotation.
    private readonly _quotation: MidaAssetPairQuotation;

    // Represents the tick time.
    private readonly _time: Date;

    public constructor (quotation: MidaAssetPairQuotation, time: Date) {
        this._quotation = quotation;
        this._time = new Date(time);
    }

    public get quotation (): MidaAssetPairQuotation {
        return this._quotation;
    }

    public get time (): Date {
        return new Date(this._time);
    }

    public get assetPair (): MidaAssetPair {
        return this._quotation.assetPair;
    }

    public get symbol (): string {
        return this._quotation.assetPair.symbol;
    }

    public get bid (): number {
        return this._quotation.bid;
    }

    public get ask (): number {
        return this._quotation.ask;
    }

    public get spread (): number {
        return this._quotation.spread;
    }

    public equals (object: any): boolean {
        return (
            object instanceof MidaAssetPairTick
            && this._quotation.equals(object._quotation)
            && this._time.valueOf() === object._time.valueOf()
        );
    }

    public clone (): MidaAssetPairTick {
        return new MidaAssetPairTick(this._quotation.clone(), this._time);
    }

    /*
     **
     *** Static Utilities
     **
    */

    public static getTicksInTimeRange (ticks: MidaAssetPairTick[], fromTime: Date, toTime: Date): MidaAssetPairTick[] {
        const ticksInTimeRange: MidaAssetPairTick[] = [];
        
        for (const tick of ticks) {
            const time: Date = tick.time;

            if (time >= fromTime && time <= toTime) {
                ticksInTimeRange.push(tick);
            }
        }

        return ticksInTimeRange;
    }
}
