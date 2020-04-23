import { MidaPosition } from "#position/MidaPosition";
import { MidaPositionDirectives } from "#position/MidaPositionDirectives";

export interface IMidaBroker {
    // Indicates if the user is logged in.
    loggedIn: boolean;

    // Used to login.
    login (accountMeta: any): Promise<boolean>;

    // Used to place a trade.
    openPosition (positionDirectives: MidaPositionDirectives): Promise<boolean>;

    // Used to get all the open positions.
    getOpenPositions (): Promise<MidaPosition[]>;

    // Used to logout.
    logout (): Promise<boolean>;

    // Used to get the actual equity.
    //getEquity (): Promise<number>;
}
