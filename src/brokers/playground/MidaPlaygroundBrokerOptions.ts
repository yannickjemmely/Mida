import { MidaCurrency } from "#currency/MidaCurrency";

export type MidaPlaygroundBrokerOptions = {
    currency?: MidaCurrency;

    negativeBalanceProtection?: boolean;
    initialBalance?: number;

    fixedCommission?: {
        [forexPairId: string]: number;
    };

    fixedSwaps?: {
        [forexPairId: string]: number;
    };

    initialTime?: Date;
};
