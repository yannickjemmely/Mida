import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerOrderType } from "#orders/MidaBrokerOrderType";
import { MidaSymbolParameters } from "#symbols/MidaSymbolParameters";
import { MidaSymbolType } from "#symbols/MidaSymbolType";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";

/** Represents a symbol. */
export class MidaSymbol {
    private readonly _symbol: string;
    private readonly _brokerAccount: MidaBrokerAccount;
    private readonly _description: string;
    private readonly _type: MidaSymbolType;
    private readonly _digits: number;
    private readonly _leverage: number;

    public constructor ({ symbol, brokerAccount, description, type, digits, leverage, }: MidaSymbolParameters) {
        this._symbol = symbol;
        this._brokerAccount = brokerAccount;
        this._description = description;
        this._type = type;
        this._digits = digits;
        this._leverage = leverage;
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

    public async getLastTick (): Promise<MidaSymbolTick> {
        return this._brokerAccount.getSymbolLastTick(this._symbol);
    }

    public async getBid (): Promise<number> {
        return (await this.getLastTick()).bid;
    }

    public async getAsk (): Promise<number> {
        return (await this.getLastTick()).ask;
    }

    public async getRequiredMargin (lots: number, type: MidaBrokerOrderType): Promise<number> {
        const lastTick: MidaSymbolTick = await this.getLastTick();

        if (type === MidaBrokerOrderType.SELL) {
            return this._leverage * lastTick.bid * lots;
        }

        return this._leverage * lastTick.ask * lots;
    }

    public async isMarketOpen (): Promise<boolean> {
        return this._brokerAccount.isSymbolMarketOpen(this._symbol);
    }

    /** Used to get the symbol represented as string. */
    public toString (): string {
        return this._symbol;
    }
}
