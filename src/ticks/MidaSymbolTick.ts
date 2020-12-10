import { MidaSymbolQuotation } from "#quotations/MidaSymbolQuotation";
import { IMidaEquatable } from "#utilities/equatable/IMidaEquatable";
import { IMidaCloneable } from "#utilities/cloneable/IMidaCloneable";
import { MidaSymbolTickParameters } from "#ticks/MidaSymbolTickParameters";

// Represents a symbol tick.
export class MidaSymbolTick implements IMidaEquatable, IMidaCloneable {
    // Represents the tick symbol.
    private readonly _quotation: MidaSymbolQuotation;

    // Represents the tick time.
    private readonly _time: Date;

    // Represents the tick previous to this.
    private readonly _previousTick?: MidaSymbolTick;

    // Represents the tick next to this.
    private readonly _nextTick?: MidaSymbolTick;

    public constructor ({ quotation, time, previousTick = undefined, nextTick = undefined, }: MidaSymbolTickParameters) {
        this._quotation = quotation;
        this._time = new Date(time);
        this._previousTick = previousTick;
        this._nextTick = nextTick;
    }

    public get quotation (): MidaSymbolQuotation {
        return this._quotation.clone();
    }

    public get time (): Date {
        return new Date(this._time);
    }

    public get previousTick (): MidaSymbolTick | undefined {
        return this._previousTick;
    }

    public get nextTick (): MidaSymbolTick | undefined {
        return this._nextTick;
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
        return new MidaSymbolTick({
            quotation: this._quotation.clone(),
            time: new Date(this._time),
            previousTick: this._previousTick?.clone(),
        });
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
