import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerOrderType } from "#orders/MidaBrokerOrderType";
import { MidaSymbolParameters } from "#symbols/MidaSymbolParameters";
import { MidaSymbolSpreadType } from "#symbols/MidaSymbolSpreadType";
import { MidaSymbolType } from "#symbols/MidaSymbolType";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaEmitter } from "#utilities/emitter/MidaEmitter";

/** Represents a symbol. */
export class MidaSymbol {
    private readonly _symbol: string;
    private readonly _brokerAccount: MidaBrokerAccount;
    private readonly _description: string;
    private readonly _type: MidaSymbolType;
    private readonly _digits: number;
    private readonly _spreadType: MidaSymbolSpreadType;
    private readonly _leverage: number;
    private readonly _minVolume: number;
    private readonly _maxVolume: number;
    private readonly _emitter: MidaEmitter;

    public constructor ({
        symbol,
        brokerAccount,
        description,
        type,
        digits,
        spreadType,
        leverage,
        minVolume,
        maxVolume,
    }: MidaSymbolParameters) {
        this._symbol = symbol;
        this._brokerAccount = brokerAccount;
        this._description = description;
        this._type = type;
        this._digits = digits;
        this._spreadType = spreadType;
        this._leverage = leverage;
        this._minVolume = minVolume;
        this._maxVolume = maxVolume;
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

    /** The symbol spread type. */
    public get spreadType (): MidaSymbolSpreadType {
        return this._spreadType;
    }

    /** The symbol leverage. */
    public get leverage (): number {
        return this._leverage;
    }

    /** Used to get the latest symbol tick. */
    public async getLastTick (): Promise<MidaSymbolTick> {
        return this._brokerAccount.getSymbolLastTick(this._symbol);
    }

    /** Used to get the latest symbol bid quote. */
    public async getBid (): Promise<number> {
        const lastTick: MidaSymbolTick = await this.getLastTick();

        return lastTick.bid;
    }

    /** Used to get the latest symbol ask quote. */
    public async getAsk (): Promise<number> {
        const lastTick: MidaSymbolTick = await this.getLastTick();

        return lastTick.ask;
    }

    /**
     * Used to get the required margin for opening an order at the actual price.
     * @param type The order type.
     * @param volume The order volume.
     * @returns The required margin to open the order.
     */
    public async getRequiredMargin (type: MidaBrokerOrderType, volume: number): Promise<number> {
        const lastTick: MidaSymbolTick = await this.getLastTick();

        if (type === MidaBrokerOrderType.SELL) {
            return this._leverage * lastTick.bid * volume;
        }
        else if (type === MidaBrokerOrderType.BUY) {
            return this._leverage * lastTick.ask * volume;
        }

        throw new Error();
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
