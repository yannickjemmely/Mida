import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaSymbolSpreadType } from "#symbols/MidaSymbolSpreadType";
import { MidaSymbolType } from "#symbols/MidaSymbolType";

/** The parameters of the symbol constructor. */
export type MidaSymbolParameters = {
    symbol: string;
    brokerAccount: MidaBrokerAccount;
    description: string;
    type: MidaSymbolType;
    digits: number;
    spreadType: MidaSymbolSpreadType;
    leverage: number;
    minVolume: number;
    maxVolume: number;
};
