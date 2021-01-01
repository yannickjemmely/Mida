import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccountType } from "#brokers/MidaBrokerAccountType";
import { MidaBrokerPosition } from "#positions/MidaBrokerPosition";
import { MidaBrokerPositionStatusType } from "#positions/MidaBrokerPositionStatusType";
import { MidaSymbolQuotationPriceType } from "#/quotations/MidaSymbolQuotationPriceType";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaSymbol } from "#symbols/MidaSymbol";
import { MidaSymbolPeriod } from "#/periods/MidaSymbolPeriod";

// Represents the account of a broker.
export abstract class MidaBrokerAccount {
    // Represents the account id.
    private readonly _id: string;

    // Represents the account name.
    private readonly _name: string;

    // Represents the account type.
    private readonly _type: MidaBrokerAccountType;

    // Represents the account broker.
    private readonly _broker: MidaBroker;

    // Indicates if the account is disconnected.
    private _isDisconnected: boolean;

    protected constructor (id: string, name: string, type: MidaBrokerAccountType, broker: MidaBroker) {
        this._id = id;
        this._name = name;
        this._type = type;
        this._broker = broker;
        this._isDisconnected = false;
    }

    public get id (): string {
        return this._id;
    }

    public get name (): string {
        return this._name;
    }

    public get type (): MidaBrokerAccountType {
        return this._type;
    }

    public get broker (): MidaBroker {
        return this._broker;
    }

    public async getPing (): Promise<number> {
        this._assertConnection();

        return this._getPing();
    }

    public async disconnect (): Promise<void> {
        this._assertConnection();
        await this._disconnect();

        this._isDisconnected = true;
    }

    protected abstract async _getPing (): Promise<number>;

    protected abstract async _disconnect (): Promise<void>;

    public abstract async getBalance (): Promise<number>;

    public abstract async getEquity (): Promise<number>;

    public abstract async getMargin (): Promise<number>;

    public abstract async getFreeMargin (): Promise<number>;

    public abstract async createPosition (directives: MidaBrokerOrderDirectives): Promise<MidaBrokerPosition>;

    public abstract async getPositions (): Promise<MidaBrokerPosition[]>;

    public abstract async getSupportedSymbols (): Promise<MidaSymbol[]>;

    public abstract async isSymbolMarketOpen (symbol: string): Promise<boolean>;

    public abstract async getCurrency (): Promise<string>;

    public abstract async getSymbolLeverage (symbol: string): Promise<any>;

    public abstract async getSymbolPeriods (
        symbol: string,
        timeframe: number,
        from?: Date,
        to?: Date,
        count?: number,
        priceType?: MidaSymbolQuotationPriceType
    ): Promise<MidaSymbolPeriod[]>;

    public abstract async getSymbolLastTick (symbol: string): Promise<MidaSymbolTick[]>;

    public async getPositionsByStatus (status: MidaBrokerPositionStatusType): Promise<MidaBrokerPosition[]> {
        const positions: MidaBrokerPosition[] = await this.getPositions();
        const foundPositions: MidaBrokerPosition[] = [];

        await Promise.all(positions.map(async (position: MidaBrokerPosition): Promise<void> => {
            if ((await position.getStatus()) === status) {
                foundPositions.push(position);
            }
        }));

        return foundPositions;
    }

    public async getUsedMargin (): Promise<number> {
        return (await this.getMargin()) - (await this.getFreeMargin());
    }

    public async getMarginLevel (): Promise<number> {
        this._assertConnection();
        
        const usedMargin: number = await this.getUsedMargin();

        if (usedMargin === 0) {
            return NaN;
        }

        return (await this.getEquity()) / usedMargin * 100;
    }

    private _assertConnection (): void {
        if (this._isDisconnected) {
            throw new Error();
        }
    }

    private async _assertPromiseDuration (promise: Promise<any>, timeout: number): Promise<any> {

    }
}
