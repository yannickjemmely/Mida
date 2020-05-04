import {MidaPosition} from "#position/MidaPosition";
import {AMidaScalper} from "#scalpers/AMidaScalper";
import {MidaScalperOptions} from "#scalpers/MidaScalperOptions";
import {MidaUtilities} from "#utilities/MidaUtilities";
import {MidaPositionDirectionType} from "#position/MidaPositionDirectionType";
import {AlphaVantage} from "#utilities/AlphaVantage";

export class MidaVolatileScalperA extends AMidaScalper {
    private _volatilePair: boolean;
    private _lastPositionOpenDate: Date | null;
    private _thirtyMinutesTimeframe: Date;

    public constructor (options: MidaScalperOptions) {
        super(options);

        this._volatilePair = false;
        this._lastPositionOpenDate = null;
        this._thirtyMinutesTimeframe = new Date();
    }

    protected async updatePositions (openPositions: MidaPosition[]): Promise<void> {
        for (const position of openPositions) {
            const profit: number = position.profit;
            const elapsedMinutes: number = MidaUtilities.getMinutesBetweenDates(position.openDate, new Date());

            if (
                (profit >= 2.5) ||
                (profit < -80) ||
                (profit < -50 && elapsedMinutes >= 10) ||
                (profit > 0 && elapsedMinutes >= 5) ||
                (elapsedMinutes >= 15)
            ) {
                console.log("CLOSED PROFIT " + profit);
                await position.close();
            }
        }
    }

    protected async update (forexPairPrice: number): Promise<void> {
        if (this._lastPositionOpenDate && MidaUtilities.getMinutesBetweenDates(this._lastPositionOpenDate, new Date()) < 1) {
            console.log("IDLE...");
            return;
        }

        const priceVariationsSecondsAgo: number[] = this.getPricesInTimeRange(new Date(Date.now() - 15000), new Date());

        // Assert volatility.
        if (priceVariationsSecondsAgo.length < 10) {
            console.log("NO VOLATILITY...");
            return;
        }
/*
        let RSI: any = await AlphaVantage.getRSI();

        if (!RSI) {
            return;
        }

        RSI = RSI.RSI;

        console.log("RSI => " + RSI);

        if (RSI < 40) {
            await this.openPosition({
                forexPair: this.forexPair,
                direction: MidaPositionDirectionType.BUY,
                lots: 2,
            });

            console.log("Opened BUY...");
            this._lastPositionOpenDate = new Date();
        }
        else if (RSI > 50) {
            await this.openPosition({
                forexPair: this.forexPair,
                direction: MidaPositionDirectionType.SELL,
                lots: 2,
            });

            console.log("Opened SELL...");
            this._lastPositionOpenDate = new Date();
        }

        console.log("----------------------------------------------------------------------------");*/
    }
}
