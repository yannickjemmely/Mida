import { MidaSymbolQuotation } from "#/quotations/MidaSymbolQuotation";
import { IMidaEquatable } from "#utilities/equatable/IMidaEquatable";
import { IMidaCloneable } from "#utilities/cloneable/IMidaCloneable";

// Represents the tick of a symbol.
export class MidaSymbolTick implements IMidaEquatable, IMidaCloneable {
    // Represents the tick symbol.
    private readonly _quotation: MidaSymbolQuotation;

    // Represents the tick time.
    private readonly _time: Date;

    public constructor (quotation: MidaSymbolQuotation, time: Date) {
        this._quotation = quotation.clone();
        this._time = new Date(time);
    }

    public get quotation (): MidaSymbolQuotation {
        return this._quotation.clone();
    }

    public get time (): Date {
        return new Date(this._time);
    }

    public get symbol (): string {
        return this._quotation.symbol;
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
            object instanceof MidaSymbolTick
            && this._quotation.equals(object._quotation)
            && this._time.valueOf() === object._time.valueOf()
        );
    }

    public clone (): any {
        return new MidaSymbolTick(this._quotation, this._time);
    }

    /*
     **
     *** Static Utilities
     **
    */

    public static getTicksInTimeRange (ticks: MidaSymbolTick[], from: Date, to: Date): MidaSymbolTick[] {
        const ticksInTimeRange: MidaSymbolTick[] = [];

        for (const tick of ticks) {
            const time: Date = tick.time;

            if (time >= from && time <= to) {
                ticksInTimeRange.push(tick);
            }
        }

        return ticksInTimeRange;
    }
}
