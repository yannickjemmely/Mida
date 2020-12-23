import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerPositionParameters } from "#positions/MidaBrokerPositionParameters";
import { MidaBrokerPositionStatusType } from "#positions/MidaBrokerPositionStatusType";
import { MidaBrokerPositionType } from "#positions/MidaBrokerPositionType";
import { IMidaEquatable } from "#utilities/equatable/IMidaEquatable";

// Represents a position.
export abstract class MidaBrokerPosition implements IMidaEquatable {
    // Represents the position ticket.
    private readonly _ticket: number;

    // Represents the position creation time.
    private readonly _creationTime: Date;

    // Represents the position symbol.
    private readonly _symbol: string;

    // Represents the position account.
    private readonly _account: MidaBrokerAccount;

    // Represents the position tags.
    private readonly _tags: Set<string>;

    protected constructor ({ ticket, creationTime, symbol, account, tags = [], }: MidaBrokerPositionParameters) {
        this._ticket = ticket;
        this._creationTime = new Date(creationTime);
        this._symbol = symbol;
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

    public get account (): MidaBrokerAccount {
        return this._account;
    }

    public get tags (): string[] {
        return [ ...this._tags, ];
    }

    public abstract async getType (): Promise<MidaBrokerPositionType>;

    public abstract async getLots (): Promise<number>;

    public abstract async setLots (lots: number): Promise<void>;

    public abstract async getStatus (): Promise<MidaBrokerPositionStatusType>;

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

    public abstract async getProfit (): Promise<number>;

    public abstract async getCommision (): Promise<number>;

    public abstract async getSwap (): Promise<number>;

    public abstract async getCurrency (): Promise<string>;

    public abstract async getLeverage (): Promise<undefined>;
    
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
        return this._account.isSymbolMarketOpen(this.symbol);
    }

    public equals (object: any): boolean {
        return object instanceof MidaBrokerPosition && object._ticket === this._ticket;
    }
}
