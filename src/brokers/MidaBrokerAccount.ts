import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccountType } from "#brokers/MidaBrokerAccountType";
import { MidaPosition } from "#positions/MidaPosition";
import { MidaPositionDirectives } from "#positions/MidaPositionDirectives";
import { MidaPositionStatusType } from "#positions/MidaPositionStatusType";
import { MidaSymbolQuotationPriceType } from "#/quotations/MidaSymbolQuotationPriceType";
import { MidaFinancialCandle } from "#/charts/candlesticks/MidaFinancialCandle";
import { MidaSymbolTick } from "#/ticks/MidaSymbolTick";
import { MidaSymbol } from "#symbols/MidaSymbol";
import { MidaSymbolPeriodType } from "#quotations/MidaSymbolPeriodType";
import { MidaSymbolPeriod } from "#quotations/MidaSymbolPeriod";

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

    protected constructor (id: string, name: string, type: MidaBrokerAccountType, broker: MidaBroker) {
        this._id = id;
        this._name = name;
        this._type = type;
        this._broker = broker;
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

    public abstract async getBalance (): Promise<number>;

    public abstract async getEquity (): Promise<number>;

    public abstract async getMargin (): Promise<number>;

    public abstract async getFreeMargin (): Promise<number>;

    public abstract async createPosition (directives: MidaPositionDirectives): Promise<MidaPosition>;

    public abstract async getPositions (): Promise<MidaPosition[]>;

    public abstract async getAvailableSymbols (): Promise<MidaSymbol[]>;

    public abstract async isSymbolMarketOpen (symbol: string): Promise<boolean>;

    public abstract async getCurrency (): Promise<string>;

    public abstract async getSymbolLeverage (symbol: string): Promise<any>;

    public abstract async getSymbolQuotationPeriods (
        symbol: string,
        timeframe: MidaSymbolPeriodType,
        priceType?: MidaSymbolQuotationPriceType,
        from?: Date,
        to?: Date,
    ): Promise<MidaSymbolPeriod[]>;

    public abstract async getSymbolLastTick (symbol: string): Promise<MidaSymbolTick[]>;

    public async getTradesByStatus (status: MidaPositionStatusType): Promise<MidaPosition[]> {
        const positions: MidaPosition[] = await this.getPositions();
        const openPositions: MidaPosition[] = [];

        await Promise.all(positions.map(async (position: MidaPosition): Promise<void> => {
            if ((await position.getStatus()) === status) {
                openPositions.push(position);
            }
        }));

        return openPositions;
    }

    public async getOpenTrades (): Promise<MidaPosition[]> {
        return this.getTradesByStatus(MidaPositionStatusType.OPEN);
    }

    public async getUsedMargin (): Promise<number> {
        return (await this.getMargin()) - (await this.getFreeMargin());
    }

    public async getMarginLevel (): Promise<number> {
        const usedMargin: number = await this.getUsedMargin();

        if (usedMargin === 0) {
            return NaN;
        }

        return (await this.getEquity()) / usedMargin;
    }
}
