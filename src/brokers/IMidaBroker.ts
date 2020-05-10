import { MidaCurrency } from "#currency/MidaCurrency";
import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaForexPairExchangeRate } from "#forex/MidaForexPairExchangeRate";
import { MidaPosition } from "#position/MidaPosition";
import { MidaPositionDirectives } from "#position/MidaPositionDirectives";
import { MidaPositionStatusType } from "#position/MidaPositionStatusType";

export interface IMidaBroker {
    // Indicates if the user is logged in.
    isLoggedIn: boolean;

    // Represents the name of the broker.
    name: string;

    // Used to login.
    login (meta?: any): Promise<boolean>;

    // Used to open a position.
    openPosition (positionDirectives: MidaPositionDirectives): Promise<MidaPosition>;

    // Used to get a position by its UUID.
    getPositionByUUID (UUID: string): Promise<MidaPosition | null>;

    // Used to close a position by its UUID.
    closePositionByUUID (UUID: string): Promise<boolean>;

    // Used to get positions by their status.
    getPositionsByStatus (status: MidaPositionStatusType): Promise<MidaPosition[]>;

    // Used to get the actual equity.
    getEquity (): Promise<number>;

    // Used to get the currency of the equity.
    getEquityCurrency (): Promise<MidaCurrency>;

    // Used to get the actual exchange rate of a forex pair.
    getForexPairExchangeRate (forexPair: MidaForexPair): Promise<MidaForexPairExchangeRate>;

    // Used to logout.
    logout (): Promise<boolean>;
}
