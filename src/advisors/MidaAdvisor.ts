import { MidaAdvisorParameters } from "#advisors/MidaAdvisorParameters";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";

export abstract class MidaAdvisor {
    // Represents the advisor options.
    private readonly _options: MidaAdvisorParameters;

    // Represents the broker account used to operate.
    private readonly _brokerAccount: MidaBrokerAccount;

    // Represents the operated symbol.
    private readonly _symbol: string;

    // Represents the created orders.
    private readonly _positions: Map<number, MidaBrokerOrder>;

    // Indicates if the advisor is operative.
    private _operative: boolean;

    // Represents the captured ticks of the operated asset pair.
    private readonly _capturedTicks: MidaSymbolTick[];

    // Represents the async tick.
    private _asyncTickPromise: Promise<void> | undefined;

    // Represents the queue of the async captured ticks.
    private readonly _asyncTicks: MidaSymbolTick[];

    protected constructor (options: MidaAdvisorParameters) {
        this._options = options;
        this._brokerAccount = options.brokerAccount;
        this._symbol = options.symbol;
        this._positions = new Map();
        this._operative = false;
        this._capturedTicks = [];
        this._asyncTickPromise = undefined;
        this._asyncTicks = [];

        this._construct();

        if (options.operative) {
            this.start();
        }
    }

    public get options (): MidaAdvisorParameters {
        return this._options;
    }

    public get brokerAccount (): MidaBrokerAccount {
        return this._brokerAccount;
    }

    public get symbol (): string {
        return this._symbol;
    }

    public get operative (): boolean {
        return this._operative;
    }

    public get positions (): readonly MidaBrokerOrder[] {
        return [ ...this._positions.values(), ];
    }

    protected get capturedTicks (): readonly MidaSymbolTick[] {
        return this._capturedTicks;
    }

    public async start (): Promise<void> {
        if (this._operative) {
            return;
        }

        this._operative = true;
    }

    public stop (): void {
        if (!this._operative) {
            return;
        }

        this._operative = false;
    }

    protected abstract onTick (tick: MidaSymbolTick): void;

    protected abstract onTickAsync (tick: MidaSymbolTick): Promise<void>;

    protected async placeOrder (directives: MidaBrokerOrderDirectives): Promise<MidaBrokerOrder> {
        const order: MidaBrokerOrder = await this._brokerAccount.placeOrder(directives);

        this._positions.set(order.ticket, order);

        return order;
    }

    private _construct (): void {
        
    }

    private _onTick (tick: MidaSymbolTick): void {
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

    private async _onTickAsync (tick: MidaSymbolTick): Promise<void> {
        try {
            this._asyncTickPromise = this.onTickAsync(tick);

            await this._asyncTickPromise;
        }
        catch (error) {
            console.error(error);
        }

        const nextTick: MidaSymbolTick | undefined = this._asyncTicks.shift();

        if (nextTick) {
            this._onTickAsync(nextTick);
        }
        else {
            this._asyncTickPromise = undefined;
        }
    }
}
