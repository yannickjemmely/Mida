import { MidaAssetPair } from "#assets/MidaAssetPair";
import { MidaAssetPairPeriod } from "#assets/MidaAssetPairPeriod";
import { MidaAssetPairPeriodType } from "#assets/MidaAssetPairPeriodType";
import { MidaAssetPairTick } from "#assets/MidaAssetPairTick";
import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccountType } from "#brokers/MidaBrokerAccountType";
import { MidaCurrency } from "#currencies/MidaCurrency";
import { MidaEvent } from "#events/MidaEvent";
import { MidaPosition } from "#positions/MidaPosition";
import { MidaPositionStatusType } from "#positions/MidaPositionStatusType";
import { MidaObservable } from "#utilities/observable/MidaObservable";

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

    // Represents the account symbols listeners.
    private readonly _symbolListeners: MidaObservable;

    protected constructor (id: string, name: string, type: MidaBrokerAccountType, broker: MidaBroker) {
        this._id = id;
        this._name = name;
        this._type = type;
        this._broker = broker;
        this._symbolListeners = new MidaObservable();
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

    public abstract async getMarginLevel (): Promise<number>;

    public abstract async getFreeMargin (): Promise<number>;

    public abstract async openPosition (): Promise<MidaPosition>;

    public abstract async getPositions (): Promise<MidaPosition[]>;

    public abstract async supportsMarket (symbol: string): Promise<boolean>;

    public abstract async isMarketOpen (symbol: string): Promise<boolean>;

    public abstract async getCurrency (): Promise<MidaCurrency>;

    public abstract async getLeverage (symbol: string): Promise<any>;

    public abstract async getSymbolLastTick (symbol: string): Promise<MidaAssetPairTick>;

    public abstract async getSymbolPeriods (symbol: string, type: MidaAssetPairPeriodType | number): Promise<MidaAssetPairPeriod[]>;

    public addSymbolEventListener (symbol: string, type: string, listener: (event: MidaEvent) => void): string {
        return this._symbolListeners.addEventListener(symbol + type, listener);
    }

    public removeSymbolEventListener (uuid: string): void {
        this._symbolListeners.removeEventListener(uuid);
    }

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

    public async getAssetPairPeriods (assetPair: MidaAssetPair, type: MidaAssetPairPeriodType | number): Promise<MidaAssetPairPeriod[]> {
        return this.getSymbolPeriods(assetPair.symbol, type);
    }

    protected notifySymbolEvent (symbol: string, type: string, event: MidaEvent): void {
        this._symbolListeners.notifyEvent(symbol + type, event);
    }
}
