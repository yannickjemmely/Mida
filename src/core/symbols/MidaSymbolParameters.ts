import { MidaAsset } from "#assets/MidaAsset";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaSymbol } from "#symbols/MidaSymbol";
import { MidaSymbolCategory } from "#symbols/MidaSymbolCategory";

/**
 * The symbol constructor parameters
 * @see MidaSymbol
 */
export type MidaSymbolParameters = {
    symbol: string;
    brokerAccount: MidaBrokerAccount;
    description: string;
    baseAsset: MidaAsset;
    quoteAsset: MidaAsset;
    type: MidaSymbolCategory;
    digits: number;
    leverage: number;
    minLots: number;
    maxLots: number;
    lotUnits: number;
};
