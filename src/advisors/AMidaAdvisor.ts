import { MidaAdvisorEventType } from "#advisors/MidaAdvisorEventType";
import { MidaAdvisorOptions } from "#advisors/MidaAdvisorOptions";
import { AMidaBroker } from "#broker/AMidaBroker";
import { MidaBrokerEventType } from "#broker/MidaBrokerEventType";
import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaForexPairExchangeRate } from "#forex/MidaForexPairExchangeRate";
import { MidaForexPairPeriod } from "#forex/MidaForexPairPeriod";
import { MidaPosition } from "#position/MidaPosition";
import { MidaPositionDirectives } from "#position/MidaPositionDirectives";
import { MidaPositionSet } from "#position/MidaPositionSet";
import { MidaPositionStatusType } from "#position/MidaPositionStatusType";
import { AMidaObservable } from "#utilities/observable/AMidaObservable";

export abstract class AMidaAdvisor extends AMidaObservable<MidaAdvisorEventType> {
    // Represents the advisor options.
    private readonly _options: MidaAdvisorOptions;

    // Represents the broker used to operate.
    private readonly _broker: AMidaBroker;

    // Represents the operated forex pair.
    private readonly _forexPair: MidaForexPair;

    // Represents the created positions.
    private readonly _positions: MidaPositionSet;

    // Represents the forex pair ticks listener uuid.
    private _forexPairTickListenerUuid: string;

    // Indicates if the advisor is operative.
    private _isOperative: boolean;

    // Represents the captured ticks of the operated forex pair.
    private readonly _capturedTicks: MidaForexPairExchangeRate[];

    // Represents the async tick.
    private _asyncTickPromise: Promise<void> | null;

    // Represents the async captured ticks queue.
    private readonly _asyncTicks: MidaForexPairExchangeRate[];

    protected constructor (options: MidaAdvisorOptions) {
        super();

        this._options = options;
        this._broker = options.broker;
        this._forexPair = options.forexPair;
        this._positions = new MidaPositionSet();
        this._forexPairTickListenerUuid = "";
        this._isOperative = false;
        this._capturedTicks = [];
        this._asyncTickPromise = null;
        this._asyncTicks = [];

        this._construct();

        if (options.operative) {
            this.start();
        }
    }

    public get options (): MidaAdvisorOptions {
        return this._options;
    }

    public get broker (): AMidaBroker {
        return this._broker;
    }

    public get forexPair (): MidaForexPair {
        return this._forexPair;
    }

    public get isOperative (): boolean {
        return this._isOperative;
    }

    public get positions (): readonly MidaPosition[] {
        return this._positions.toArray();
    }

    protected get capturedTicks (): readonly MidaForexPairExchangeRate[] {
        return this._capturedTicks;
    }

    public start (): void {
        if (this._isOperative) {
            return;
        }

        if (!this._broker.isLoggedIn) {
            throw new Error();
        }

        this._isOperative = true;

        this.notifyEvent(MidaAdvisorEventType.START, this);
    }

    public stop (): void {
        if (!this._isOperative) {
            return;
        }

        this._isOperative = false;

        this.notifyEvent(MidaAdvisorEventType.STOP, this);
    }

    public async closeAllPositions (): Promise<void> {
        await Promise.all(this.getPositionsByStatus(MidaPositionStatusType.OPEN).map((position: MidaPosition): Promise<void> => position.close()));
    }

    public getPositionsByStatus (status: MidaPositionStatusType): MidaPosition[] {
        return this._positions.toArray().filter((position: MidaPosition): boolean => position.status === status);
    }

    protected abstract onTick (exchangeRate: MidaForexPairExchangeRate): void;

    protected abstract async onTickAsync (exchangeRate: MidaForexPairExchangeRate): Promise<void>;

    protected onPeriod (period: MidaForexPairPeriod): void {
        // Silence is golden.
    }

    protected async onPeriodAsync (period: MidaForexPairPeriod): Promise<void> {
        // Silence is golden.
    }

    protected getTicksInTimeRange (fromTime: Date, toTime: Date): MidaForexPairExchangeRate[] {
        const matchedTicks: MidaForexPairExchangeRate[] = [];

        for (const capturedTick of this._capturedTicks) {
            const time: Date = capturedTick.time;

            if (time >= fromTime && time <= toTime) {
                matchedTicks.push(capturedTick);
            }
        }

        return matchedTicks;
    }

    protected async openPosition (directives: MidaPositionDirectives): Promise<MidaPosition> {
        const position: MidaPosition = await this._broker.openPosition(directives);

        this._positions.add(position);
        this.notifyEvent(MidaAdvisorEventType.POSITION_OPEN, position, this);

        return position;
    }

    private _construct (): void {
        this._broker.addEventListener(MidaBrokerEventType.LOGOUT, (): void => this._onBrokerLogout());
        this._broker.addEventListener(MidaBrokerEventType.POSITION_CLOSE, (position: MidaPosition): void => this._onBrokerPositionClose(position));
        this._broker.addForexPairTickListener(this._forexPair, (exchangeRate: MidaForexPairExchangeRate): void => this._onTick(exchangeRate));
    }

    private _onBrokerLogout (): void {
        if (this._isOperative) {
            this.stop();
        }
    }

    private _onBrokerPositionClose (position: MidaPosition): void {
        if (this._positions.has(position.uuid)) {
            this.notifyEvent(MidaAdvisorEventType.POSITION_CLOSE, position);
        }
    }

    private _onTick (exchangeRate: MidaForexPairExchangeRate): void {
        if (!this._isOperative) {
            return;
        }

        this._capturedTicks.push(exchangeRate);

        if (this._asyncTickPromise) {
            this._asyncTicks.push(exchangeRate);
        }
        else {
            this._onTickAsync(exchangeRate);
        }

        try {
            this.onTick(exchangeRate);
        }
        catch (error) {
            console.error(error);
        }
    }

    private async _onTickAsync (exchangeRate: MidaForexPairExchangeRate): Promise<void> {
        try {
            this._asyncTickPromise = this.onTickAsync(exchangeRate);

            await this._asyncTickPromise;
        }
        catch (error) {
            console.error(error);
        }

        const nextTick: MidaForexPairExchangeRate | undefined = this._asyncTicks.shift();

        if (nextTick) {
            this._onTickAsync(nextTick);
        }
        else {
            this._asyncTickPromise = null;
        }
    }
}
