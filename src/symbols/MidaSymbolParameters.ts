import { MidaSymbolType } from "#symbols/MidaSymbolType";

// Represents the parameters of the symbol constructor.
export type MidaSymbolParameters = {
    symbol: string;
    description: string;
    type: MidaSymbolType;
    digits: number;
};
