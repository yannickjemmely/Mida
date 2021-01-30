import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaSymbolType } from "#symbols/MidaSymbolType";

/** The parameters of the symbol constructor. */
export type MidaSymbolParameters = {
    /** The symbol represented as string. */
    symbol: string;

    /** The symbol broker account. */
    brokerAccount: MidaBrokerAccount;

    /** The symbol description. */
    description: string;

    /** The symbol type. */
    type: MidaSymbolType;

    /** The symbol digits. */
    digits: number;
};
