import { IMidaBroker } from "#brokers/IMidaBroker";
import { MidaForexPairExchangeRate } from "#forex/MidaForexPairExchangeRate";
import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaPosition } from "#position/MidaPosition";
import { MidaPositionDirectives } from "#position/MidaPositionDirectives";
import { MidaPositionStatusType } from "#position/MidaPositionStatusType";
import { MidaScalperOptions } from "#scalpers/MidaScalperOptions";
import { MidaUtilities } from "#utilities/MidaUtilities";
import { IMidaObservable } from "#utilities/events/IMidaObservable";
import { MidaListenerDispatcher } from "#utilities/events/MidaListenerDispatcher";

export abstract class AMidaScalper implements IMidaObservable {
    // Represents the delay between each forex pair exchange rate change check.
    private static readonly _UPDATE_DELAY: number = 300;

    // Represents the scalper options.
    private readonly _options: MidaScalperOptions;

    // Represents the broker.
    private readonly _broker: IMidaBroker;

    // Represents the operated forex pair.
    private readonly _forexPair: MidaForexPair;

    // Represents the forex pair exchange rate changes during the scalper activity.
    private readonly _exchangeRateHistory: {
        [date: string]: MidaForexPairExchangeRate;
    };

    // Represents a list of created positions (UUIDs).
    private readonly _createdPositions: string[];

    // Represents the listener dispatcher.
    private readonly _listenerDispatcher: MidaListenerDispatcher;

    // Indicates if the scalper is operating.
    private _isActive: boolean;

    protected constructor (options: MidaScalperOptions) {
        this._options = options;
        this._broker = options.broker;
        this._forexPair = options.forexPair;
        this._exchangeRateHistory = {};
        this._createdPositions = [];
        this._listenerDispatcher = new MidaListenerDispatcher();
        this._isActive = false;
    }

    public get isActive (): boolean {
        return this._isActive;
    }

    protected get forexPair (): MidaForexPair {
        return this._forexPair;
    }

    public start (): void {
        if (this._isActive) {
            return;
        }

        this._isActive = true;

        this._internalUpdate();
        this._listenerDispatcher.notifyListeners("start");
    }

    public stop (closePositions: boolean = false): void {
        if (!this._isActive) {
            return;
        }

        this._isActive = false;

        if (closePositions) {
            this.closeAllPositions();
        }

        this._listenerDispatcher.notifyListeners("stop");
    }

    public addEventListener (eventName: string, listener: Function): string {
        return this._listenerDispatcher.addListener(eventName, listener);
    }

    public removeEventListener (listenerUUID: string): boolean {
        return this._listenerDispatcher.removeListener(listenerUUID);
    }

    protected abstract async update (forexPairExchangeRate: MidaForexPairExchangeRate): Promise<void>;

    protected async openPosition (positionDirectives: MidaPositionDirectives): Promise<MidaPosition> {
        const position: MidaPosition = await this._broker.openPosition(positionDirectives);

        this._createdPositions.push(position.UUID);
        this._listenerDispatcher.notifyListeners("position-create", position);

        return position;
    }

    protected async getPositionsByStatus (status: MidaPositionStatusType): Promise<MidaPosition[]> {
        const positions: MidaPosition[] = [];

        for (const positionUUID of this._createdPositions) {
            const position: MidaPosition | null = await this._broker.getPositionByUUID(positionUUID);

            if (position && position.status === status) {
                positions.push(position);
            }
        }

        return positions;
    }

    protected getPricesInDateRange (leftDate: Date, rightDate: Date): number[] {
        const prices: number[] = [];

        for (const plainDate in this._exchangeRateHistory) {
            const date: Date = new Date(plainDate);

            if (date >= leftDate && date <= rightDate) {
                prices.push(this._exchangeRateHistory[plainDate].price);
            }
        }

        return prices;
    }

    protected async updatePositions (openPositions: MidaPosition[]): Promise<void> {
        for (const position of openPositions) {
            const profit: number = position.profit;
            // const elapsedMinutes: number = MidaUtilities.getMinutesBetweenDates(position.openDate, new Date());

            if (profit >= 5 || profit < -115) {
                await position.close();

                console.log("Closed with profit " + profit);
            }
        }
    }

    protected async closeAllPositions (): Promise<void> {
        const openPositions: MidaPosition[] = await this.getPositionsByStatus(MidaPositionStatusType.OPEN);

        for (const position of openPositions) {
            await position.close();
        }
    }

    private async _internalUpdate (previousForexPairExchangeRate?: MidaForexPairExchangeRate): Promise<void> {
        const forexPairExchangeRate: MidaForexPairExchangeRate = await this._broker.getForexPairExchangeRate(this._forexPair);

        if (!previousForexPairExchangeRate || forexPairExchangeRate.price !== previousForexPairExchangeRate.price) {
            this._exchangeRateHistory[forexPairExchangeRate.date.toISOString()] = forexPairExchangeRate;

            await this.updatePositions(await this.getPositionsByStatus(MidaPositionStatusType.OPEN));
            await this.update(forexPairExchangeRate);
        }

        if (!this._isActive) {
            return;
        }

        await MidaUtilities.wait(AMidaScalper._UPDATE_DELAY);
        this._internalUpdate(forexPairExchangeRate);
    }
}
