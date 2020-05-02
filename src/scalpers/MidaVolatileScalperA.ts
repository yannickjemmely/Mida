import { MidaScalper } from "#scalpers/MidaScalper";
import { MidaScalperOptions } from "#scalpers/MidaScalperOptions";

export class MidaVolatileScalperA extends MidaScalper {
    private _volatilePair: boolean;
    private _lastPositionOpenDate: Date | null;

    public constructor (options: MidaScalperOptions) {
        super(options);

        this._volatilePair = false;
        this._lastPositionOpenDate = null;
    }

    protected async update (forexPairPrice: number): Promise<void> {
        const date: Date = new Date();
        const pricesFiveSecondsAgo: number[] = this.getPricesInTimeRange(new Date(Date.now() - 5000), date);
        const pricesTenSecondsAgo: number[] = this.getPricesInTimeRange(new Date(Date.now() - 10000), date);

        if (pricesFiveSecondsAgo.length >= 2 && pricesTenSecondsAgo.length >= 5) {
            const direction: number = pricesFiveSecondsAgo[0] < pricesFiveSecondsAgo[pricesFiveSecondsAgo.length - 1] ? 1 : 0;

            console.log(direction === 1 ? "up" : "down");
        }
        else {
            console.log("NEUTRAL");
        }
    }
}
