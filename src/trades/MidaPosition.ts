import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaPositionParameters } from "#positions/MidaPositionParameters";
import { MidaPositionStatusType } from "#positions/MidaPositionStatusType";
import { MidaPositionType } from "#positions/MidaPositionType";
import { IMidaEquatable } from "#utilities/equatable/IMidaEquatable";

// Represents a position.
export abstract class MidaPosition implements IMidaEquatable {
    // Represents the position ticket.
    private readonly _ticket: number;

    // Represents the position creation time.
    private readonly _creationTime: Date;

    // Represents the position symbol.
    private readonly _symbol: string;

    // Represents the position type.
    private readonly _type: MidaPositionType;

    // Represents the position lots.
    private readonly _lots: number;

    // Represents the position account.
    private readonly _account: MidaBrokerAccount;

    // Represents the position tags.
    private readonly _tags: Set<string>;

    protected constructor ({ ticket, creationTime, symbol, type, lots, account, tags = [], }: MidaPositionParameters) {
        this._ticket = ticket;
        this._creationTime = new Date(creationTime);
        this._symbol = symbol;
        this._type = type;
        this._lots = lots;
        this._account = account;
        this._tags = new Set(tags);
    }

    public get ticket (): number {
        return this._ticket;
    }

    public get creationTime (): Date {
        return new Date(this._creationTime);
    }

    public get symbol (): string {
        return this._symbol;
    }

    public get type (): MidaPositionType {
        return this._type;
    }

    public get lots (): number {
        return this._lots;
    }

    public get account (): MidaBrokerAccount {
        return this._account;
    }

    public get tags (): string[] {
        return [ ...this._tags, ];
    }

    public abstract async getStatus (): Promise<MidaPositionStatusType>;

    public abstract async getCancelTime (): Promise<Date | undefined>;

    public abstract async getOpenTime (): Promise<Date | undefined>;

    public abstract async getCloseTime (): Promise<Date | undefined>;

    public abstract async getOpenPrice (): Promise<number | undefined>;

    public abstract async getClosePrice (): Promise<number | undefined>;

    // <stop-loss-management>
    public abstract async getStopLoss (): Promise<number | undefined>;

    public abstract async setStopLoss (stopLoss: number): Promise<void>;

    public abstract async clearStopLoss (): Promise<void>;
    // </stop-loss-management>

    // <take-profit-management>
    public abstract async getTakeProfit (): Promise<number | undefined>;

    public abstract async setTakeProfit (takeProfit: number): Promise<void>;

    public abstract async clearTakeProfit (): Promise<void>;
    // </take-profit-management>

    // <sell-stop-management>
    public abstract async getSellStop (): Promise<number | undefined>;

    public abstract async setSellStop (sellStop: number): Promise<void>;

    public abstract async clearSellStop (): Promise<void>;
    // </sell-stop-management>

    // <sell-limit-management>
    public abstract async getSellLimit (): Promise<number | undefined>;

    public abstract async setSellLimit (sellLimit: number): Promise<void>;

    public abstract async clearSellLimit (): Promise<void>;
    // </sell-limit-management>

    // <buy-stop-management>
    public abstract async getBuyStop (): Promise<number | undefined>;

    public abstract async setBuyStop (buyStop: number): Promise<void>;

    public abstract async clearBuyStop (): Promise<void>;
    // </buy-stop-management>

    // <buy-limit-management>
    public abstract async getBuyLimit (): Promise<number | undefined>;

    public abstract async setBuyLimit (buyLimit: number): Promise<void>;

    public abstract async clearBuyLimit (): Promise<void>;
    // </buy-limit-management>

    public abstract async getProfit (): Promise<number>;

    public abstract async getCommision (): Promise<number>;

    public abstract async getSwap (): Promise<number>;

    public abstract async getCurrency (): Promise<string>;

    public abstract async getLeverage (): Promise<undefined>;

    public abstract async cancel (): Promise<void>;
    
    public abstract async close (): Promise<void>;

    public addTag (tag: string): void {
        this._tags.add(tag);
    }

    public hasTag (tag: string): boolean {
        return this._tags.has(tag);
    }

    public removeTag (tag: string): void {
        this._tags.delete(tag);
    }

    public async isMarketOpen (): Promise<boolean> {
        return this._account.isMarketOpen(this.symbol);
    }

    public async isPending (): Promise<boolean> {
        return (await this.getStatus()) === MidaPositionStatusType.PENDING_OPEN;
    }

    public async isCanceled (): Promise<boolean> {
        return (await this.getStatus()) === MidaPositionStatusType.CANCELED;
    }

    public async isOpen (): Promise<boolean> {
        return (await this.getStatus()) === MidaPositionStatusType.OPEN;
    }

    public async isClosed (): Promise<boolean> {
        return (await this.getStatus()) === MidaPositionStatusType.CLOSED;
    }

    public equals (object: any): boolean {
        return object instanceof MidaPosition && object._ticket === this._ticket;
    }
}
