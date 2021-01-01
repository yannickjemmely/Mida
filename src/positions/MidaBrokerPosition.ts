import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerPositionParameters } from "#positions/MidaBrokerPositionParameters";
import { MidaBrokerPositionType } from "#positions/MidaBrokerPositionType";
import { IMidaEquatable } from "#utilities/equatable/IMidaEquatable";

// Represents a position.
export class MidaBrokerPosition implements IMidaEquatable {
    // Represents the position ticket.
    private readonly _ticket: number;

    // Represents the position broker account.
    private readonly _brokerAccount: MidaBrokerAccount;

    // Represents the position symbol.
    private readonly _symbol: string;

    // Represents the position type.
    private readonly _type: MidaBrokerPositionType;

    // Represents the position tags.
    private readonly _tags: Set<string>;

    protected constructor ({ ticket, brokerAccount, symbol, type, tags = [], }: MidaBrokerPositionParameters) {
        this._ticket = ticket;
        this._brokerAccount = brokerAccount;
        this._symbol = symbol;
        this._type = type;
        this._tags = new Set(tags);
    }

    public get ticket (): number {
        return this._ticket;
    }

    public get brokerAccount (): MidaBrokerAccount {
        return this._brokerAccount;
    }

    public get symbol (): string {
        return this._symbol;
    }

    public get type (): MidaBrokerPositionType {
        return this._type;
    }

    public get tags (): string[] {
        return [ ...this._tags, ];
    }

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
        return this._brokerAccount.isSymbolMarketOpen(this.symbol);
    }

    public equals (object: any): boolean {
        return (
            object instanceof MidaBrokerPosition
            && object._brokerAccount.broker.name === this._brokerAccount.broker.name
            && object._brokerAccount.id === this._brokerAccount.id
            && object._ticket === this._ticket
        );
    }
}
