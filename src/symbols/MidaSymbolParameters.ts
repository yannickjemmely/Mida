import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaSymbolType } from "#symbols/MidaSymbolType";

/** The parameters of the symbol constructor. */
export type MidaSymbolParameters = {
    symbol: string;
    brokerAccount: MidaBrokerAccount;
    description: string;
    type: MidaSymbolType;
    digits: number;
    leverage: number;
};
