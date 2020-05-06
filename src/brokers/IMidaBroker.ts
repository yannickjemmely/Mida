import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaPosition } from "#position/MidaPosition";
import { MidaPositionDirectives } from "#position/MidaPositionDirectives";
import { MidaPositionStatusType } from "#position/MidaPositionStatusType";

export interface IMidaBroker {
    // Indicates if the user is logged in.
    isLoggedIn: boolean;

    // Used to login.
    login (meta?: any): Promise<boolean>;

    // Used to place a trade.
    openPosition (positionDirectives: MidaPositionDirectives): Promise<MidaPosition>;

    // Used to get the placed trades.
    getPositions (status: MidaPositionStatusType): Promise<MidaPosition[]>;

    // getPositionByUUID (UUID: string): Promise<MidaPosition | null>;

    // Used to get the actual equity.
    getEquity (): Promise<number>;

    // Used to get the price of a forex pair.
    getForexPairPrice (forexPair: MidaForexPair): Promise<number>;

    // Used to logout.
    logout (): Promise<boolean>;
}
