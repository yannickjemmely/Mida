import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerErrorType } from "#brokers/MidaBrokerErrorType";
import { MidaError } from "#errors/MidaError";
import { MidaBrokerOrderType } from "#orders/MidaBrokerOrderType";
import { MidaSymbolParameters } from "#symbols/MidaSymbolParameters";
import { MidaSymbolType } from "#symbols/MidaSymbolType";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaEmitter } from "#utilities/emitters/MidaEmitter";

/** Represents a symbol. */
export class MidaSymbol {
    private readonly _symbol: string;
    private readonly _brokerAccount: MidaBrokerAccount;
    private readonly _description: string;
    private readonly _type: MidaSymbolType;
    private readonly _digits: number;
    private readonly _leverage: number;
    private readonly _minLots: number;
    private readonly _maxLots: number;
    private readonly _lotUnits: number;
    private readonly _emitter: MidaEmitter;

    public constructor ({
        symbol,
        brokerAccount,
        description,
        type,
        digits,
        leverage,
        minLots,
        maxLots,
        lotUnits,
    }: MidaSymbolParameters) {
        this._symbol = symbol;
        this._brokerAccount = brokerAccount;
        this._description = description;
        this._type = type;
        this._digits = digits;
        this._leverage = leverage;
        this._minLots = minLots;
        this._maxLots = maxLots;
        this._lotUnits = lotUnits;
        this._emitter = new MidaEmitter();
    }

    /** The symbol broker account. */
    public get brokerAccount (): MidaBrokerAccount {
        return this._brokerAccount;
    }

    /** The symbol description. */
    public get description (): string {
        return this._description;
    }

    /** The symbol type. */
    public get type (): MidaSymbolType {
        return this._type;
    }

    /** The symbol digits. */
    public get digits (): number {
        return this._digits;
    }

    /** The symbol leverage. */
    public get leverage (): number {
        return this._leverage;
    }

    /** The symbol minimum lots order. */
    public get minLots (): number {
        return this._minLots;
    }

    /** The symbol maximum lots order. */
    public get maxLots (): number {
        return this._maxLots;
    }

    /** The symbol units for one lot. */
    public get lotUnits (): number {
        return this._lotUnits;
    }

    /** Used to get the latest symbol tick. */
    public async getLastTick (): Promise<MidaSymbolTick | undefined> {
        return this._brokerAccount.getSymbolLastTick(this._symbol);
    }

    /** Used to get the latest symbol bid quote. */
    public async getBid (): Promise<number> {
        return this._brokerAccount.getSymbolBid(this._symbol);
    }

    /** Used to get the latest symbol ask quote. */
    public async getAsk (): Promise<number> {
        return this._brokerAccount.getSymbolAsk(this._symbol);
    }

    /**
     * Used to get the required margin for opening an order at the latest quote.
     * @param type The order type.
     * @param lots The order lots.
     */
    public async getRequiredMargin (type: MidaBrokerOrderType, lots: number): Promise<number> {
        if (type === MidaBrokerOrderType.SELL) {
            return this._leverage * (await this.getBid()) * lots;
        }
        else if (type === MidaBrokerOrderType.BUY) {
            return this._leverage * (await this.getAsk())  * lots;
        }

        throw new MidaError({ type: MidaBrokerErrorType.INVALID_ORDER_DIRECTIVES, });
    }

    /** Used to know if the symbol market is open. */
    public async isMarketOpen (): Promise<boolean> {
        return this._brokerAccount.isSymbolMarketOpen(this._symbol);
    }

    /** Used to get the symbol represented as string. */
    public toString (): string {
        return this._symbol;
    }
}
