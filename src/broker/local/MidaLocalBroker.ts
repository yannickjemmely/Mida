import {AMidaBroker} from "#broker/AMidaBroker";
import {MidaBrokerAccountType} from "#broker/MidaBrokerAccountType";
import {MidaForexPairExchangeRate} from "#forex/MidaForexPairExchangeRate";
import {MidaPositionDirectionType} from "#position/MidaPositionDirectionType";
import {MidaPositionSet} from "#position/MidaPositionSet";
import {MidaPositionStatusType} from "#position/MidaPositionStatusType";
import {MidaPrivateObservable} from "#utilities/observable/AMidaObservable";
import {MidaForexPair} from "#forex/MidaForexPair";
import {MidaForexPairPeriod} from "#forex/MidaForexPairPeriod";
import {MidaLocalBrokerOptions} from "#broker/local/MidaLocalBrokerOptions";

// @ts-ignore
export class MidaLocalBroker extends AMidaBroker {
    private readonly _options: Readonly<MidaLocalBrokerOptions>;

    // Represents the actual time of the broker.
    private _time: Date;

    // Represents the the time series of a forex pair.
    private readonly _ticks: {
        [forexPairID: string]: MidaForexPairExchangeRate[];
    };

    private readonly _positions: MidaPositionSet;

    // Represents the forex pair tick listeners.
    private readonly _forexPairTickListeners: MidaPrivateObservable;

    // Represents the forex pair period listeners.
    private readonly _forexPairPeriodListeners: MidaPrivateObservable;

    private _balance: number;
    private _equity: number;

    public constructor (options: MidaLocalBrokerOptions) {
        super();

        this._options = options;
        this._time = new Date(0);
        this._ticks = {};
        this._positions = new MidaPositionSet();
        this._forexPairTickListeners = new MidaPrivateObservable();
        this._forexPairPeriodListeners = new MidaPrivateObservable();
        this._balance = 10000;
        this._equity = this._balance;
    }

    public get isLoggedIn (): boolean {
        return true;
    }

    public get accountID (): string {
        return "";
    }

    public get accountType (): MidaBrokerAccountType {
        return MidaBrokerAccountType.DEMO;
    }

    public get name (): string {
        return this.constructor.name;
    }

    public async login (): Promise<void> {
        throw new Error();
    }
/*
    public async openPosition (directives: MidaPositionDirectives): Promise<MidaPosition> {
        this._positions.add({
            broker: {
                name: this.name,
                accountID: "",
                positionID: "",
            },
            directives,
            status: MidaPositionStatusType.OPEN,
            openDate: new Date(),
            openPrice: 0,
        });
    }*/

    public async getBalance (): Promise<number> {
        return this._balance;
    }

    public async resetBalance (): Promise<void> {
        this._balance = 10000;
    }

    public addForexPairTickListener (forexPair: MidaForexPair, listener: (exchangeRate: MidaForexPairExchangeRate) => void): string {
        return this._forexPairTickListeners.addEventListener(forexPair.ID, listener);
    }

    public removeForexPairTickListener (UUID: string): boolean {
        return this._forexPairTickListeners.removeEventListener(UUID);
    }

    public addForexPairPeriodListener (forexPair: MidaForexPair, listener: (period: MidaForexPairPeriod) => void): string {
        return this._forexPairPeriodListeners.addEventListener(forexPair.ID, listener);
    }

    public removeForexPairPeriodListener (UUID: string): boolean {
        return this._forexPairPeriodListeners.removeEventListener(UUID);
    }

    public loadTicks (ticks: MidaForexPairExchangeRate[]): void {
        const internalTicks: MidaForexPairExchangeRate[] = [ ...(this._ticks[ticks[0].forexPair.ID] || []), ...ticks ];

        internalTicks.sort((left: MidaForexPairExchangeRate, right: MidaForexPairExchangeRate): number => left.date.valueOf() - right.date.valueOf());

        this._ticks[ticks[0].forexPair.ID] = internalTicks;
    }

    public addTime (milliseconds: number = 1000): void {
        const previousTime: Date = this._time;
        const actualTime: Date = new Date(previousTime.valueOf() + milliseconds);
        const capturedTicks: MidaForexPairExchangeRate[] = [];

        this._time = actualTime;

        for (const forexPairID in this._ticks) {
            const forexPairTicks: MidaForexPairExchangeRate[] = this._ticks[forexPairID];

            for (const tick of forexPairTicks) {
                if (tick.date > previousTime && tick.date <= actualTime) {
                    capturedTicks.push(tick);
                }
            }
        }

        capturedTicks.sort((left: MidaForexPairExchangeRate, right: MidaForexPairExchangeRate): number => left.date.valueOf() - right.date.valueOf());
        capturedTicks.forEach((tick: MidaForexPairExchangeRate): void => this._onTick(tick));
    }

    public async getForexPairExchangeRate (forexPair: MidaForexPair): Promise<MidaForexPairExchangeRate> {
        const ticks: MidaForexPairExchangeRate[] = this._ticks[forexPair.ID];

        for (let i: number = ticks.length - 1; i >= 0; i--) {
            if (this._time.valueOf() - ticks[i].date.valueOf() >= 0) {
                return ticks[i];
            }
        }

        throw new Error();
    }

    /*@ts-ignore/*
    public async openPosition (directives: MidaPositionDirectives): Promise<MidaPosition> {
        const UUID: string = createPositionUUID();
        const lastTick: MidaForexPairExchangeRate = this.getLastTick(directives.forexPair);
        // @ts-ignore
        const position: MidaPosition = {
            UUID,
            broker: {
                name: this.name,
                accountID: "",
                positionID: "",
            },
            directives,
            status: MidaPositionStatusType.OPEN,
            openDate: new Date(),
            openPrice: directives.direction === MidaPositionDirectionType.SELL ? lastTick.ask : lastTick.bid,
            closeDate: null,
            closePrice: null,
        };

        this._positions.add(position);
    }*/
/*
    private _calculatePositionProfit (position: MidaPosition): number {
        const closePrice: number = position.closePrice !== null ? position.closePrice : position.openPrice;
        const lastTick: MidaForexPairExchangeRate = await this.getForexPairExchangeRate(position.directives.forexPair);

        if (position.directives.direction === MidaPositionDirectionType.SELL) {
            return (closePrice - position.openPrice) * position.directives.lots * lastTick.ask;
        }

        return (position.openPrice - closePrice) * position.directives.lots * lastTick.bid;
    }*/

    private _onTick (exchangeRate: MidaForexPairExchangeRate): void {
        for (const position of this._positions.toArray()) {
            if (position.status === MidaPositionStatusType.OPEN) {
                const stopLoss: number | undefined = position.directives.stopLoss;
                const takeProfit: number | undefined = position.directives.takeProfit;

                if (position.directives.direction === MidaPositionDirectionType.BUY) {
                    if ((typeof stopLoss === "number" && exchangeRate.bid <= stopLoss) || (typeof takeProfit === "number" && exchangeRate.bid >= takeProfit)) {
                        position.close();
                    }
                }
                else {
                    if ((typeof stopLoss === "number" && exchangeRate.ask <= stopLoss) || (typeof takeProfit === "number" && exchangeRate.ask >= takeProfit)) {
                        position.close();
                    }
                }
            }
        }

        this._forexPairTickListeners.notifyEvent(exchangeRate.forexPair.ID, exchangeRate);
    }
}
