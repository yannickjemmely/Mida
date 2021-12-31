import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaSymbolCategory } from "#symbols/MidaSymbolCategory";

/** The parameters of the symbol constructor. */
export type MidaSymbolParameters = {
    symbol: string;
    brokerAccount: MidaBrokerAccount;
    description: string;
    type: MidaSymbolCategory;
    digits: number;
    leverage: number;
    minLots: number;
    maxLots: number;
    lotUnits: number;
};
