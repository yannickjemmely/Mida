import { MidaBroker } from "#brokers/MidaBroker";
import { MidaSymbol } from "#symbols/MidaSymbol";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";

// Represents a broker account.
export interface IMidaBrokerAccount {
    readonly id: string;

    readonly fullName: string;

    readonly broker: MidaBroker;

    getSymbols (): Promise<MidaSymbol[]>;

    getSymbolLastTick (symbol: string): Promise<MidaSymbolTick>;
}
