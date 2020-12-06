import { MidaQuotation } from "#/quotations/MidaQuotation";
import { IMidaEquatable } from "#utilities/equatable/IMidaEquatable";

// Represents a tick.
export class MidaTick implements IMidaEquatable {
    // Represents the tick symbol.
    private readonly _quotation: MidaQuotation;

    // Represents the tick time.
    private readonly _time: Date;

    public constructor (quotation: MidaQuotation, time: Date) {
        this._quotation = quotation;
        this._time = new Date(time);
    }

    public get quotation (): MidaQuotation {
        return this._quotation;
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
            object instanceof MidaTick
            && this._quotation.equals(object._quotation)
            && this._time.valueOf() === object._time.valueOf()
        );
    }

    /*
     **
     *** Static Utilities
     **
    */

    public static getTicksInTimeRange (ticks: MidaTick[], from: Date, to: Date): MidaTick[] {
        const ticksInTimeRange: MidaTick[] = [];

        for (const tick of ticks) {
            const time: Date = tick.time;

            if (time >= from && time <= to) {
                ticksInTimeRange.push(tick);
            }
        }

        return ticksInTimeRange;
    }
}
