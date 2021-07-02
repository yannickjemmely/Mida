import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaSymbolParameters } from "#symbols/MidaSymbolParameters";
import { MidaSymbolType } from "#symbols/MidaSymbolType";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaEmitterAsync } from "#utilities/emitters/MidaEmitter";
import { GenericObject } from "#utilities/GenericObject";

/** Represents a symbol. */
export class MidaSymbol {
    readonly #symbol: string;
    readonly #brokerAccount: MidaBrokerAccount;
    readonly #description: string;
    readonly #type: MidaSymbolType;
    readonly #digits: number;
    readonly #leverage: number;
    readonly #minLots: number;
    readonly #maxLots: number;
    readonly #lotUnits: number;
    readonly #emitter: MidaEmitterAsync;

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
        this.#symbol = symbol;
        this.#brokerAccount = brokerAccount;
        this.#description = description;
        this.#type = type;
        this.#digits = digits;
        this.#leverage = leverage;
        this.#minLots = minLots;
        this.#maxLots = maxLots;
        this.#lotUnits = lotUnits;
        this.#emitter = new MidaEmitterAsync();
    }

    /** The symbol broker account. */
    public get brokerAccount (): MidaBrokerAccount {
        return this.#brokerAccount;
    }

    /** The symbol description. */
    public get description (): string {
        return this.#description;
    }

    /** The symbol type. */
    public get type (): MidaSymbolType {
        return this.#type;
    }

    /** The symbol digits. */
    public get digits (): number {
        return this.#digits;
    }

    /** The symbol leverage. */
    public get leverage (): number {
        return this.#leverage;
    }

    /** The symbol minimum lots order. */
    public get minLots (): number {
        return this.#minLots;
    }

    /** The symbol maximum lots order. */
    public get maxLots (): number {
        return this.#maxLots;
    }

    /** The symbol units for one lot. */
    public get lotUnits (): number {
        return this.#lotUnits;
    }

    /** Used to get the latest symbol tick. */
    public async getLastTick (): Promise<MidaSymbolTick | undefined> {
        return this.#brokerAccount.getSymbolLastTick(this.#symbol);
    }

    /** Used to get the latest symbol bid quote. */
    public async getBid (): Promise<number> {
        return this.#brokerAccount.getSymbolBid(this.#symbol);
    }

    /** Used to get the latest symbol ask quote. */
    public async getAsk (): Promise<number> {
        return this.#brokerAccount.getSymbolAsk(this.#symbol);
    }

    /** Used to know if the symbol market is open. */
    public async isMarketOpen (): Promise<boolean> {
        return this.#brokerAccount.isSymbolMarketOpen(this.#symbol);
    }

    /** Used to get the symbol represented as string. */
    public toString (): string {
        return this.#symbol;
    }

    #notifyListeners (type: string, descriptor?: GenericObject): void {
        this.#emitter.notifyListeners(type, descriptor);
    }
}

/*
    Example of typed event export interface MidaSymbol {
        on (type: "tick", listener?: MidaEventListener): Promise<MidaEvent> | string;
    }
*/
