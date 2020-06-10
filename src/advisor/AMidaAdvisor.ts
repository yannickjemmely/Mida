import { MidaAdvisorEventType } from "#advisor/MidaAdvisorEventType";
import { MidaAdvisorOptions } from "#advisor/MidaAdvisorOptions";
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

    // Represents the positions created by the advisor.
    private readonly _positions: MidaPositionSet;

    // Represents the forex pair tick listener UUID.
    private _forexPairTickListenerUUID: string;

    // Indicates if the advisor is operative.
    private _isOperative: boolean;

    // Represents the captured ticks of the operated forex pair.
    private readonly _capturedTicks: MidaForexPairExchangeRate[];

    // Represents the async tick Promise.
    private _asyncTickPromise: Promise<void> | null;

    // Represents the async captured ticks queue.
    private readonly _asyncTicks: MidaForexPairExchangeRate[];

    protected constructor (options: MidaAdvisorOptions) {
        super();

        this._options = options;
        this._broker = options.broker;
        this._forexPair = options.forexPair;
        this._positions = new MidaPositionSet();
        this._forexPairTickListenerUUID = "";
        this._isOperative = false;
        this._capturedTicks = [];
        this._asyncTickPromise = null;
        this._asyncTicks = [];

        this._construct();

        if (options.operative) {
            this.start();
        }
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

    public get positions (): MidaPosition[] {
        return this._positions.toArray();
    }

    protected get capturedTicks (): ReadonlyArray<MidaForexPairExchangeRate> {
        return this._capturedTicks;
    }

    public start (): void {
        if (this._isOperative) {
            return;
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

    protected onTick (forexPairExchangeRate: MidaForexPairExchangeRate): void {
        // Silence is golden.
    }

    protected async onTickAsync (forexPairExchangeRate: MidaForexPairExchangeRate): Promise<void> {
        // Silence is golden.
    }

    protected onPeriod (forexPairPeriod: MidaForexPairPeriod): void {
        // Silence is golden.
    }

    protected async onPeriodAsync (forexPairPeriod: MidaForexPairPeriod): Promise<void> {
        // Silence is golden.
    }

    protected getTicksInDateRange (fromDate: Date, toDate: Date): MidaForexPairExchangeRate[] {
        const matchedTicks: MidaForexPairExchangeRate[] = [];

        for (const capturedTick of this._capturedTicks) {
            const date: Date = capturedTick.date;

            if (date >= fromDate && date <= toDate) {
                matchedTicks.push(capturedTick);
            }
        }

        return matchedTicks;
    }

    protected async openPosition (positionDirectives: MidaPositionDirectives): Promise<MidaPosition> {
        const position: MidaPosition = await this._broker.openPosition(positionDirectives);

        this._positions.add(position);
        this.notifyEvent(MidaAdvisorEventType.POSITION_OPEN, position, this);

        return position;
    }

    private _construct (): void {
        this._broker.addEventListener(MidaBrokerEventType.LOGOUT, (): void => {
            if (this._isOperative) {
                this.stop();
            }
        });

        this._broker.addForexPairTickListener(this._forexPair, (forexPairExchangeRate: MidaForexPairExchangeRate): void => {
            this._onTick(forexPairExchangeRate);
        });
    }

    private _onTick (forexPairExchangeRate: MidaForexPairExchangeRate): void {
        if (!this._isOperative) {
            return;
        }

        this._capturedTicks.push(forexPairExchangeRate);

        if (this._asyncTickPromise) {
            this._asyncTicks.push(forexPairExchangeRate);
        }
        else {
            this._onTickAsync(forexPairExchangeRate);
        }

        try {
            this.onTick(forexPairExchangeRate);
        }
        catch (error) {
            console.log(error);
        }
    }

    private async _onTickAsync (forexPairExchangeRate: MidaForexPairExchangeRate): Promise<void> {
        try {
            this._asyncTickPromise = this.onTickAsync(forexPairExchangeRate);

            await this._asyncTickPromise;
        }
        catch (error) {
            console.log(error);
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
