import { IMidaBroker } from "#brokers/IMidaBroker";
import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaPosition } from "#position/MidaPosition";
import { MidaPositionDirectionType } from "#position/MidaPositionDirectionType";
import { MidaPositionStatusType } from "#position/MidaPositionStatusType";
import { MidaScalperOptions } from "#scalpers/MidaScalperOptions";

export abstract class MidaScalper {
    private readonly _options: MidaScalperOptions;
    private readonly _broker: IMidaBroker;
    private readonly _forexPair: MidaForexPair;
    private readonly _pricesHistory: {
        [date: string]: number;
    };

    private _forexPairPrice: number;
    private _previousForexPairPrice: number;

    private _openPositions: MidaPosition[];

    private _sleep: boolean;

    protected constructor (options: MidaScalperOptions) {
        this._options = options;
        this._broker = options.broker;
        this._forexPair = options.forexPair;
        this._pricesHistory = {};
        this._forexPairPrice = 0;
        this._previousForexPairPrice = 0;
        this._openPositions = [];
        this._sleep = true;
    }

    public start (): void {
        if (this._sleep) {
            this._sleep = false;

            this._internalUpdate();
        }
    }

    public stop (): void {
        if (!this._sleep) {
            this._sleep = true;
        }
    }

    protected get options (): MidaScalperOptions {
        return this._options;
    }

    protected get broker (): IMidaBroker {
        return this._broker;
    }

    protected get forexPair (): MidaForexPair {
        return this._forexPair;
    }

    protected get forexPairPrice (): number {
        return this._forexPairPrice;
    }

    protected get previousForexPairPrice (): number {
        return this._previousForexPairPrice;
    }

    protected async buy (): Promise<void> {
        if (this._openPositions.length < this._options.maxPositions) {
            await this._broker.openPosition({
                forexPair: this._forexPair,
                direction: MidaPositionDirectionType.BUY,
                lots: 1,
            });
        }
    }

    protected async sell (): Promise<void> {
        if (this._openPositions.length < this._options.maxPositions) {
            await this._broker.openPosition({
                forexPair: this._forexPair,
                direction: MidaPositionDirectionType.SELL,
                lots: 1,
            });
        }
    }

    protected getPricesInTimeRange (leftDate: Date, rightDate: Date): number[] {
        const prices: number[] = [];

        for (const plainDate in this._pricesHistory) {
            const date: Date = new Date(plainDate);

            if (date >= leftDate && date <= rightDate) {
                prices.push(this._pricesHistory[plainDate]);
            }
        }

        return prices;
    }

    protected async updatePositions (): Promise<void> {
        // Silence is golden.
    }

    protected abstract async update (forexPairPrice: number): Promise<void>;

    private async _internalUpdate (): Promise<void> {
        const forexPairPrice: number = await this._broker.getForexPairPrice(this._forexPair);

        if (forexPairPrice !== this._previousForexPairPrice) {
            this._forexPairPrice = forexPairPrice;
            this._pricesHistory[(new Date).toISOString()] = forexPairPrice;
            this._openPositions = await this._broker.getPositions(MidaPositionStatusType.OPEN);

            await this.updatePositions();
            await this.update(forexPairPrice);

            this._previousForexPairPrice = forexPairPrice;
        }

        if (!this._sleep) {
            this._internalUpdate();
        }
    }
}
