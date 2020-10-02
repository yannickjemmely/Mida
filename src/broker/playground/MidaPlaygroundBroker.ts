import {AMidaBroker} from "#broker/AMidaBroker";
import {MidaBrokerAccountType} from "#broker/MidaBrokerAccountType";
import {MidaForexPairExchangeRate} from "#forex/MidaForexPairExchangeRate";
import {MidaPositionDirectionType} from "#position/MidaPositionDirectionType";
import {MidaPositionSet} from "#position/MidaPositionSet";
import {MidaPositionStatusType} from "#position/MidaPositionStatusType";
import {MidaProtectedObservable} from "#utilities/observable/AMidaObservable";
import {MidaForexPair} from "#forex/MidaForexPair";
import {MidaForexPairPeriod} from "#forex/MidaForexPairPeriod";
import {MidaForexPairPeriodType} from "#forex/MidaForexPairPeriodType";
import {MidaPlaygroundBrokerOptions} from "#broker/playground/MidaPlaygroundBrokerOptions";
import {MidaCurrency} from "#currency/MidaCurrency";
import {MidaCurrencyType} from "#currency/MidaCurrencyType";
import {generatePositionUuid, MidaPosition} from "#position/MidaPosition";
import {MidaPositionDirectives} from "#position/MidaPositionDirectives";

export class MidaPlaygroundBroker extends AMidaBroker {
    // Represents the broker options.
    private readonly _options: Readonly<MidaPlaygroundBrokerOptions>;

    // Represents the broker time.
    private _time: Date;

    // Represents the forex pairs time series.
    private readonly _ticks: {
        [forexPairId: string]: MidaForexPairExchangeRate[];
    };

    private readonly _m1Ticks: {
        [forexPairId: string]: {
            [time: string]: MidaForexPairExchangeRate[];
        };
    };

    // Represents the positions.
    private readonly _positions: MidaPositionSet;

    // Represents the forex pair tick listeners.
    private readonly _forexPairTickListeners: MidaProtectedObservable<string>;

    // Represents the forex pair period listeners.
    private readonly _forexPairPeriodListeners: MidaProtectedObservable<string>;

    // Represents the balance of the account.
    private _balance: number;

    // Represents the equity of the account.
    private _equity: number;

    public constructor (options: MidaPlaygroundBrokerOptions = {}) {
        super();

        this._options = options;
        this._time = new Date("2019-01-01T17:02:37.254Z");
        this._ticks = {};
        this._m1Ticks = {};
        this._positions = new MidaPositionSet();
        this._forexPairTickListeners = new MidaProtectedObservable();
        this._forexPairPeriodListeners = new MidaProtectedObservable();
        this._balance = 10000;
        this._equity = this._balance;
    }

    public get time (): Date {
        return this._time;
    }

    public get isLoggedIn (): boolean {
        return true;
    }

    public get accountId (): string {
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

    public async openPosition (directives: MidaPositionDirectives): Promise<MidaPosition> {
        const uuid: string = generatePositionUuid();
        const lastTick: MidaForexPairExchangeRate = await this.getForexPairExchangeRate(directives.forexPair);
        const position: MidaPosition = {
            uuid,
            broker: {
                name: this.name,
                accountId: "",
                positionId: "",
            },
            directives,
            status: MidaPositionStatusType.OPEN,
            openDate: new Date(),
            openPrice: directives.direction === MidaPositionDirectionType.SELL ? lastTick.bid : lastTick.ask,
            closeDate: null,
            closePrice: null,
            profit: async (): Promise<number> => this._getPositionProfit(uuid),
            commission: async (): Promise<number> => 0,
            swaps: async (): Promise<number> => 0,
            currency: async (): Promise<MidaCurrency> => MidaCurrencyType.EUR,
            close: async (): Promise<void> => this.closePositionByUuid(uuid),
        };

        this._positions.add(position);

        return position;
    }

    public async getPositionByUuid (UUID: string): Promise<MidaPosition | null> {
        return this._positions.get(UUID);
    }

    public async getPositionsByStatus (status: MidaPositionStatusType): Promise<MidaPosition[]> {
        return this._positions.toArray().filter((position: MidaPosition): boolean => position.status === status);
    }

    public async getPositionsByForexPair (forexPair: MidaForexPair): Promise<MidaPosition[]> {
        return this._positions.toArray().filter((position: MidaPosition): boolean => position.directives.forexPair === forexPair);
    }

    public async closePositionByUuid (UUID: string): Promise<void> {
        const position: MidaPosition | null = await this.getPositionByUuid(UUID);

        if (!position) {
            return;
        }

        const lastTick: MidaForexPairExchangeRate = await this.getForexPairExchangeRate(position.directives.forexPair);
        const closeProfit: number = await position.profit();

        position.status = MidaPositionStatusType.CLOSE;
        position.closeDate = new Date();
        position.closePrice = position.directives.direction === MidaPositionDirectionType.SELL ? lastTick.ask : lastTick.bid;
        position.profit = async (): Promise<number> => closeProfit;
        position.commission = async (): Promise<number> => 0;
        position.swaps = async (): Promise<number> => 0;
    }

    public async getBalance (): Promise<number> {
        return this._balance;
    }

    public async resetBalance (): Promise<void> {
        this._balance = 10000;
    }

    public async getEquity (): Promise<number> {
        return this._equity;
    }

    public async getFreeMargin (): Promise<number> {
        return -1;
    }

    public async getCurrency (): Promise<MidaCurrency> {
        return MidaCurrencyType.EUR;
    }

    public addForexPairTickListener (forexPair: MidaForexPair, listener: (exchangeRate: MidaForexPairExchangeRate) => void): string {
        return this._forexPairTickListeners.addEventListener(forexPair.id, listener);
    }

    public removeForexPairTickListener (UUID: string): boolean {
        return this._forexPairTickListeners.removeEventListener(UUID);
    }

    public addForexPairPeriodListener (forexPair: MidaForexPair, listener: (period: MidaForexPairPeriod) => void): string {
        return this._forexPairPeriodListeners.addEventListener(forexPair.id, listener);
    }

    public removeForexPairPeriodListener (UUID: string): boolean {
        return this._forexPairPeriodListeners.removeEventListener(UUID);
    }

    public async getForexPairExchangeRate (forexPair: MidaForexPair): Promise<MidaForexPairExchangeRate> {
        const ticks: MidaForexPairExchangeRate[] = this._ticks[forexPair.id];

        for (let i: number = ticks.length - 1; i >= 0; i--) {
            if (this._time.valueOf() - ticks[i].time.valueOf() >= 0) {
                return ticks[i];
            }
        }

        throw new Error();
    }

    public async getForexPairPeriods (forexPair: MidaForexPair, periodsType: MidaForexPairPeriodType): Promise<MidaForexPairPeriod[]> {
        const m1Periods: MidaForexPairPeriod[] = await this._getForexPairM1Periods(forexPair);

        if (m1Periods.length === 0) {
            return [];
        }

        if (periodsType === MidaForexPairPeriodType.M1) {
            return m1Periods;
        }

        const firstPeriodTime: Date = new Date(m1Periods[0].time.valueOf());

        firstPeriodTime.setMilliseconds(0);
        firstPeriodTime.setSeconds(0);
        firstPeriodTime.setMinutes(0);

        const composedPeriods: MidaForexPairPeriod[] = [];
        let actualPeriodTime: Date = new Date(firstPeriodTime.valueOf());
        let m1PeriodsToCompose: MidaForexPairPeriod[] = [];

        for (const m1Period of m1Periods) {
            if (m1Period.time > actualPeriodTime) {
                if (m1PeriodsToCompose.length > 0) {
                    composedPeriods.push({
                        forexPair,
                        type: periodsType,
                        time: actualPeriodTime,
                        open: m1PeriodsToCompose[0].open,
                        close: m1PeriodsToCompose[m1PeriodsToCompose.length - 1].close,
                        low: Math.min(...(m1PeriodsToCompose.map((period: MidaForexPairPeriod): number => period.low))),
                        high: Math.max(...(m1PeriodsToCompose.map((period: MidaForexPairPeriod): number => period.high))),
                        volume: m1PeriodsToCompose.reduce((total: number, period: MidaForexPairPeriod): number => total + period.volume, 0),
                    });

                    m1PeriodsToCompose = [];
                }

                while (m1Period.time > actualPeriodTime) {
                    actualPeriodTime = new Date(actualPeriodTime.valueOf() + periodsType * 1000);
                }
            }

            m1PeriodsToCompose.push(m1Period);
        }

        if (m1PeriodsToCompose.length > 0) {
            composedPeriods.push({
                forexPair,
                type: periodsType,
                time: actualPeriodTime,
                open: m1PeriodsToCompose[0].open,
                close: m1PeriodsToCompose[m1PeriodsToCompose.length - 1].close,
                low: Math.min(...(m1PeriodsToCompose.map((period: MidaForexPairPeriod): number => period.low))),
                high: Math.max(...(m1PeriodsToCompose.map((period: MidaForexPairPeriod): number => period.high))),
                volume: m1PeriodsToCompose.reduce((total: number, period: MidaForexPairPeriod): number => total + period.volume, 0),
            });

            m1PeriodsToCompose = [];
        }

        return composedPeriods;
    }

    public async logout (): Promise<void> {
        throw new Error();
    }

    public loadTicks (ticks: MidaForexPairExchangeRate[]): void {
        const internalTicks: MidaForexPairExchangeRate[] = [ ...(this._ticks[ticks[0].forexPair.id] || []), ...ticks ];

        internalTicks.sort((left: MidaForexPairExchangeRate, right: MidaForexPairExchangeRate): number => left.time.valueOf() - right.time.valueOf());

        this._ticks[ticks[0].forexPair.id] = internalTicks;
    }

    public async addTime (milliseconds: number = 1000): Promise<MidaForexPairExchangeRate[]> {
        const previousTime: Date = this._time;
        const actualTime: Date = new Date(previousTime.valueOf() + milliseconds);
        const matchedTicks: MidaForexPairExchangeRate[] = [];

        for (const forexPairId in this._ticks) {
            const forexPairTicks: MidaForexPairExchangeRate[] = this._ticks[forexPairId];

            for (const tick of forexPairTicks) {
                if (tick.time > previousTime && tick.time <= actualTime) {
                    matchedTicks.push(tick);
                }
            }
        }

        matchedTicks.sort((left: MidaForexPairExchangeRate, right: MidaForexPairExchangeRate): number => left.time.valueOf() - right.time.valueOf());

        for (let i: number = 0; i < matchedTicks.length; ++i) {
            const tick: MidaForexPairExchangeRate = matchedTicks[i];
            const tickTime: Date = new Date(tick.time);

            this._time = tick.time;

            tickTime.setSeconds(0);
            tickTime.setMilliseconds(0);

            if (!this._m1Ticks[tick.forexPair.id]) {
                this._m1Ticks[tick.forexPair.id] = {};
            }

            if (!this._m1Ticks[tick.forexPair.id][tickTime.toISOString()]) {
                this._m1Ticks[tick.forexPair.id][tickTime.toISOString()] = [];
            }

            this._m1Ticks[tick.forexPair.id][tickTime.toISOString()].push(tick);

            await this._onTick(tick);

            process.stdout.write("completed " + (i + 1) + "/" + matchedTicks.length + " ticks.\r");
        }

        console.log("completed " + matchedTicks.length + "/" + matchedTicks.length + " ticks.");

        this._time = actualTime;

        return matchedTicks;
    }

    public async getForexPairTicks (forexPair: MidaForexPair): Promise<MidaForexPairExchangeRate[]> {
        const forexPairTicks: MidaForexPairExchangeRate[] = this._ticks[forexPair.id];
        const capturedTicks: MidaForexPairExchangeRate[] = [];

        for (const tick of forexPairTicks) {
            if (tick.time <= this._time) {
                capturedTicks.push(tick);
            }
        }

        return capturedTicks;
    }

    private async _getPositionProfit (UUID: string): Promise<number> {
        const position: MidaPosition | null = await this.getPositionByUuid(UUID);

        if (!position) {
            throw new Error();
        }

        if (position.status === MidaPositionStatusType.CLOSE) {
            return position.profit();
        }

        const lastTick: MidaForexPairExchangeRate = await this.getForexPairExchangeRate(position.directives.forexPair);
        const closePrice: number = position.directives.direction === MidaPositionDirectionType.SELL ? lastTick.ask : lastTick.bid;
        let profit: number;

        if (position.directives.direction === MidaPositionDirectionType.SELL) {
            profit = (position.openPrice - closePrice) * position.directives.lots * 100000 * lastTick.ask;
        }
        else {
            profit = (closePrice - position.openPrice) * position.directives.lots * 100000 * lastTick.bid;
        }

        const commision: number = await position.commission();

        return profit - commision;
    }

    private async _getForexPairM1Periods (forexPair: MidaForexPair): Promise<MidaForexPairPeriod[]> {
        const m1Ticks: {
            [time: string]: MidaForexPairExchangeRate[];
        } = this._m1Ticks[forexPair.id] || {};
        const periods: MidaForexPairPeriod[] = [];

        for (const time in m1Ticks) {
            const timeTicks: MidaForexPairExchangeRate[] = m1Ticks[time];

            timeTicks.sort((left: MidaForexPairExchangeRate, right: MidaForexPairExchangeRate): number => left.time.valueOf() - right.time.valueOf());

            periods.push({
                forexPair,
                type: MidaForexPairPeriodType.M1,
                time: new Date(time),
                open: timeTicks[0].bid,
                close: timeTicks[timeTicks.length - 1].bid,
                low: Math.min(...(timeTicks.map((tick: MidaForexPairExchangeRate): number => tick.bid))),
                high: Math.max(...(timeTicks.map((tick: MidaForexPairExchangeRate): number => tick.bid))),
                volume: timeTicks.length,
            });
        }

        return periods;
    }

    private async _onTick (exchangeRate: MidaForexPairExchangeRate): Promise<void> {
        for (const position of await this.getPositionsByForexPair(exchangeRate.forexPair)) {
            if (position.status !== MidaPositionStatusType.OPEN) {
                continue;
            }

            const stopLoss: number | undefined = position.directives.stopLoss;
            const takeProfit: number | undefined = position.directives.takeProfit;

            if (position.directives.direction === MidaPositionDirectionType.BUY) {
                if ((typeof stopLoss === "number" && exchangeRate.bid <= stopLoss) || (typeof takeProfit === "number" && exchangeRate.bid >= takeProfit)) {
                    await position.close();
                }
            }
            else {
                if ((typeof stopLoss === "number" && exchangeRate.ask >= stopLoss) || (typeof takeProfit === "number" && exchangeRate.ask <= takeProfit)) {
                    await position.close();
                }
            }

            // TODO: calculate equity.
        }

        this._forexPairTickListeners.notifyEvent(exchangeRate.forexPair.id, exchangeRate);
    }
}
