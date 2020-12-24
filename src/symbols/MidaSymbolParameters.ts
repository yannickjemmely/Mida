import { MidaBroker } from "#brokers/MidaBroker";
import { MidaSymbolType } from "#symbols/MidaSymbolType";

// Represents the parameters of the symbol constructor.
export type MidaSymbolParameters = {
    symbol: string;
    broker: MidaBroker;
    description: string;
    type: MidaSymbolType;
    digits: number;
};
