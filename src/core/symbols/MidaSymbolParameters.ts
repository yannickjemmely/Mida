import { MidaAsset } from "#assets/MidaAsset";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaSymbolCategory } from "#symbols/MidaSymbolCategory";

/** The symbol constructor parameters */
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
