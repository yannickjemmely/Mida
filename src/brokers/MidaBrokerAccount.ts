import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccountParameters } from "#brokers/MidaBrokerAccountParameters";
import { MidaBrokerAccountType } from "#brokers/MidaBrokerAccountType";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";
import { MidaBrokerPosition } from "#positions/MidaBrokerPosition";
import { MidaBrokerPositionStatusType } from "#positions/MidaBrokerPositionStatusType";
import { MidaSymbolQuotationPriceType } from "#/quotations/MidaSymbolQuotationPriceType";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaSymbol } from "#symbols/MidaSymbol";
import { MidaSymbolPeriod } from "#/periods/MidaSymbolPeriod";
import { MidaSymbolType } from "#symbols/MidaSymbolType";

// Represents a broker account.
export abstract class MidaBrokerAccount {
    // Represents the account id.
    private readonly _id: string;

    // Represents the account broker.
    private readonly _broker: MidaBroker;

    // Represents the account type.
    private readonly _type: MidaBrokerAccountType;

    // Represents the account full name.
    private readonly _fullName: string;

    // Indicates if the account is connected to the broker.
    private _isConnected: boolean;

    protected constructor ({ id, fullName, type, broker, }: MidaBrokerAccountParameters) {
        this._id = id;
        this._fullName = fullName;
        this._type = type;
        this._broker = broker;
        this._isConnected = false;
    }

    public get id (): string {
        return this._id;
    }

    public get type (): MidaBrokerAccountType {
        return this._type;
    }

    public get broker (): MidaBroker {
        return this._broker;
    }

    public get fullName (): string {
        return this._fullName;
    }

    public async getPing (): Promise<number> {
        this._assertConnection();

        return this._getPing();
    }

    public async disconnect (): Promise<void> {
        this._assertConnection();
        await this._disconnect();

        this._isConnected = true;
    }

    protected abstract async _getPing (): Promise<number>;

    protected abstract async _disconnect (): Promise<void>;

    public abstract async getBalance (): Promise<number>;

    public abstract async getEquity (): Promise<number>;

    public abstract async getMargin (): Promise<number>;

    public abstract async getFreeMargin (): Promise<number>;

    public abstract async placeOrder (directives: MidaBrokerOrderDirectives): Promise<MidaBrokerPosition>;

    public abstract async getPositions (): Promise<MidaBrokerPosition[]>;

    public abstract async getSymbols (): Promise<MidaSymbol[]>;

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

    public async getSymbolsByType (type: MidaSymbolType): Promise<MidaSymbol[]> {
        return [];
    }

    private _assertConnection (): void {
        if (!this._isConnected) {
            throw new Error();
        }
    }
}
