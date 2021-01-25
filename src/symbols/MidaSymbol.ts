import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerOrderType } from "#orders/MidaBrokerOrderType";
import { MidaSymbolParameters } from "#symbols/MidaSymbolParameters";
import { MidaSymbolType } from "#symbols/MidaSymbolType";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";

// Represents a symbol.
export class MidaSymbol {
    // Represents the symbol as string.
    private readonly _symbol: string;

    // Represents the broker account that issued this symbol.
    private readonly _brokerAccount: MidaBrokerAccount;

    // Represents the symbol description.
    private readonly _description: string;

    // Represents the symbol type.
    private readonly _type: MidaSymbolType;

    // Represents the symbol digits.
    private readonly _digits: number;

    public constructor ({ symbol, brokerAccount, description, type, digits, }: MidaSymbolParameters) {
        this._symbol = symbol;
        this._brokerAccount = brokerAccount;
        this._description = description;
        this._type = type;
        this._digits = digits;
    }

    public get brokerAccount (): MidaBrokerAccount {
        return this._brokerAccount;
    }

    public get description (): string {
        return this._description;
    }

    public get type (): MidaSymbolType {
        return this._type;
    }

    public get digits (): number {
        return this._digits;
    }

    public async getLastTick (): Promise<MidaSymbolTick> {
        return this._brokerAccount.getSymbolLastTick(this._symbol);
    }

    public async calculateRequiredMargin (lots: number, type: MidaBrokerOrderType): Promise<number> {
        throw new Error();
    }

    public async isMarketOpen (): Promise<boolean> {
        return this._brokerAccount.isSymbolMarketOpen(this._symbol);
    }

    public toString (): string {
        return this._symbol;
    }
}
