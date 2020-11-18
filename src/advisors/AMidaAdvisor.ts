import { MidaAdvisorEventType } from "#advisors/MidaAdvisorEventType";
import { MidaAdvisorOptions } from "#advisors/MidaAdvisorOptions";
import { AMidaPosition } from "#positions/AMidaPosition";
import { MidaPositionDirectives } from "#positions/MidaPositionDirectives";
import { AMidaBrokerAccount } from "#brokers/AMidaBrokerAccount";
import { MidaAssetPair } from "#assets/MidaAssetPair";
import { MidaAssetPairTick } from "#assets/MidaAssetPairTick";

export abstract class AMidaAdvisor {
    // Represents the advisor options.
    private readonly _options: MidaAdvisorOptions;

    // Represents the broker account used to operate.
    private readonly _brokerAccount: AMidaBrokerAccount;

    // Represents the operated asset pair.
    private readonly _assetPair: MidaAssetPair;

    // Represents the created positions.
    private readonly _positions: AMidaPosition[];

    // Indicates if the advisor is operative.
    private _operative: boolean;

    // Represents the captured ticks of the operated asset pair.
    private readonly _capturedTicks: MidaAssetPairTick[];

    // Represents the async tick.
    private _asyncTickPromise: Promise<void> | undefined;

    // Represents the queue of the async captured ticks.
    private readonly _asyncTicks: MidaAssetPairTick[];

    protected constructor (options: MidaAdvisorOptions) {
        this._options = options;
        this._brokerAccount = options.brokerAccount;
        this._assetPair = options.assetPair;
        this._positions = [];
        this._operative = false;
        this._capturedTicks = [];
        this._asyncTickPromise = undefined;
        this._asyncTicks = [];

        this._construct();

        if (options.operative) {
            this.start();
        }
    }

    public get options (): MidaAdvisorOptions {
        return this._options;
    }

    public get brokerAccount (): AMidaBrokerAccount {
        return this._brokerAccount;
    }

    public get assetPair (): MidaAssetPair {
        return this._assetPair;
    }

    public get operative (): boolean {
        return this._operative;
    }

    public get positions (): readonly AMidaPosition[] {
        return this._positions;
    }

    protected get capturedTicks (): readonly MidaAssetPairTick[] {
        return this._capturedTicks;
    }

    public async start (): Promise<void> {
        if (this._operative) {
            return;
        }

        if (!(await this._brokerAccount.isAlive())) {
            throw new Error();
        }

        this._operative = true;
    }

    public stop (): void {
        if (!this._operative) {
            return;
        }

        this._operative = false;
    }

    protected abstract onTick (tick: MidaAssetPairTick): void;

    protected abstract async onTickAsync (tick: MidaAssetPairTick): Promise<void>;

    protected getTicksInTimeRange (fromTime: Date, toTime: Date): MidaAssetPairTick[] {
        return MidaAssetPairTick.getTicksInTimeRange(this._capturedTicks, fromTime, toTime);
    }

    protected async openPosition (directives: MidaPositionDirectives): Promise<MidaPosition> {
        const position: MidaPosition = await this._broker.openPosition(directives);

        this._positions.add(position);
        this.notifyEvent(MidaAdvisorEventType.POSITION_OPEN, position, this);

        return position;
    }

    private _construct (): void {

    }

    private _onTick (tick: MidaAssetPairTick): void {
        if (!this._operative) {
            return;
        }

        this._capturedTicks.push(tick);

        if (this._asyncTickPromise) {
            this._asyncTicks.push(tick);
        }
        else {
            this._onTickAsync(tick);
        }

        try {
            this.onTick(tick);
        }
        catch (error) {
            console.error(error);
        }
    }

    private async _onTickAsync (tick: MidaAssetPairTick): Promise<void> {
        try {
            this._asyncTickPromise = this.onTickAsync(tick);

            await this._asyncTickPromise;
        }
        catch (error) {
            console.error(error);
        }

        const nextTick: MidaAssetPairTick | undefined = this._asyncTicks.shift();

        if (nextTick) {
            this._onTickAsync(nextTick);
        }
        else {
            this._asyncTickPromise = undefined;
        }
    }
}
