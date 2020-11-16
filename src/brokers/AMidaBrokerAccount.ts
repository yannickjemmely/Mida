import { MidaAssetPair } from "#assets/MidaAssetPair";
import { MidaAssetPairPeriod } from "#assets/MidaAssetPairPeriod";
import { MidaAssetPairPeriodType } from "#assets/MidaAssetPairPeriodType";
import { MidaAssetPairQuotation } from "#assets/MidaAssetPairQuotation";
import { AMidaBroker } from "#brokers/AMidaBroker";
import { MidaBrokerAccountType } from "#brokers/MidaBrokerAccountType";
import { AMidaPosition } from "#positions/AMidaPosition";
import { MidaPositionStatusType } from "#positions/MidaPositionStatusType";

// Represents the account of a broker.
export abstract class AMidaBrokerAccount {
    // Represents the account id.
    private readonly _id: string;

    // Represents the account name.
    private readonly _name: string;

    // Represents the account type.
    private readonly _type: MidaBrokerAccountType;

    // Represents the account broker.
    private readonly _broker: AMidaBroker;

    protected constructor (id: string, name: string, type: MidaBrokerAccountType, broker: AMidaBroker) {
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

    public get broker (): AMidaBroker {
        return this._broker;
    }

    public abstract async isAlive (): Promise<boolean>;

    public abstract async getBalance (): Promise<number>;

    public abstract async getEquity (): Promise<number>;

    public abstract async getMargin (): Promise<number>;

    public abstract async getMarginLevel (): Promise<number>;

    public abstract async getFreeMargin (): Promise<number>;

    public abstract async openPosition (): Promise<AMidaPosition>;

    public abstract async getPositions (): Promise<AMidaPosition[]>;

    public abstract async supportsMarket (symbol: string): Promise<boolean>;

    public abstract async isMarketOpen (symbol: string): Promise<boolean>;

    public abstract async getLeverage (symbol: string): Promise<any>;

    public abstract async getSymbolQuotation (symbol: string): Promise<MidaAssetPairQuotation>;

    public abstract async getSymbolPeriods (symbol: string, type: MidaAssetPairPeriodType | number): Promise<MidaAssetPairPeriod[]>;

    public async getOpenPositions (): Promise<AMidaPosition[]> {
        const positions: AMidaPosition[] = await this.getPositions();
        const openPositions: AMidaPosition[] = [];

        await Promise.all(positions.map(async (position: AMidaPosition): Promise<void> => {
            const status: MidaPositionStatusType = await position.getStatus();

            if (status === MidaPositionStatusType.OPEN) {
                openPositions.push(position);
            }
        }));

        return openPositions;
    }

    public async getAssetPairPeriods (assetPair: MidaAssetPair, type: MidaAssetPairPeriodType | number): Promise<MidaAssetPairPeriod[]> {
        return this.getSymbolPeriods(assetPair.symbol, type);
    }
}
