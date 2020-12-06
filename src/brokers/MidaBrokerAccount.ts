import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccountType } from "#brokers/MidaBrokerAccountType";
import { MidaPosition } from "#positions/MidaPosition";
import { MidaPositionDirectives } from "#positions/MidaPositionDirectives";
import { MidaPositionStatusType } from "#positions/MidaPositionStatusType";
import { MidaQuotationPriceType } from "#/quotations/MidaQuotationPriceType";
import { MidaCandlestick } from "#/charts/candlesticks/MidaCandlestick";
import { MidaTick } from "#/ticks/MidaTick";

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

    public abstract async supportsSymbol (symbol: string): Promise<boolean>;

    public abstract async isMarketOpen (symbol: string): Promise<boolean>;

    public abstract async getCurrency (): Promise<string>;

    public abstract async getLeverage (symbol: string): Promise<any>;

    public abstract async getCandlesticks (symbol: string, priceType: MidaQuotationPriceType): Promise<MidaCandlestick[]>;

    public abstract async getTicks (symbol: string): Promise<MidaTick[]>;

    public abstract async getLastTick (symbol: string): Promise<MidaTick>;

    public async getOpenPositions (): Promise<MidaPosition[]> {
        const positions: MidaPosition[] = await this.getPositions();
        const openPositions: MidaPosition[] = [];

        await Promise.all(positions.map(async (position: MidaPosition): Promise<void> => {
            const status: MidaPositionStatusType = await position.getStatus();

            if (status === MidaPositionStatusType.OPEN) {
                openPositions.push(position);
            }
        }));

        return openPositions;
    }

    public async getUsedMargin (): Promise<number> {
        return (await this.getMargin()) - (await this.getFreeMargin());
    }

    public async getMarginLevel (): Promise<number> {
        return (await this.getEquity()) / (await this.getUsedMargin());
    }
}
