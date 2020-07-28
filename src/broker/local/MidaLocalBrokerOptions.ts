import { MidaCurrency } from "#currency/MidaCurrency";

export type MidaLocalBrokerOptions = {
    currency?: MidaCurrency;

    negativeEquityProtection?: boolean;
    initialBalance?: number;

    fixedCommission?: {
        [forexPairID: string]: number;
    };

    fixedSwaps?: {
        [forexPairID: string]: number;
    };

    initialTime?: Date;
};
