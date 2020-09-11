import { MidaCurrency } from "#currency/MidaCurrency";

export type MidaPlaygroundBrokerOptions = {
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
