import { v1 as UUIDV1 } from "uuid";
import { MidaCurrency } from "#currency/MidaCurrency";
import { MidaPositionDirectives } from "#position/MidaPositionDirectives";
import { MidaPositionStatusType } from "#position/MidaPositionStatusType";

// Represents a position.
export type MidaPosition = {
    // Represents the position universally unique identifier.
    readonly UUID: string;

    // Represents a piece of information about the broker used to open the position.
    broker: {
        // Represents the name of the broker.
        name: string;

        // Represents the broker account ID.
        accountID: string;

        // Represents the broker position ID.
        positionID: string;
    };

    // Represents the position directives.
    directives: MidaPositionDirectives;

    // Represents the position status.
    status: MidaPositionStatusType;

    // Represents the position open date.
    openDate: Date;

    // Represents the position open price.
    openPrice: number;

    // Represents the position close date.
    closeDate: Date | null;

    // Represents the position close price.
    closePrice: number | null;

    // Represents the lowest position profit.
    lowestProfit: number;

    // Represents the highest position profit.
    highestProfit: number;

    // Used to get the actual profit of the position.
    profit (): Promise<number>;

    // Used to get the actual commission of the position.
    commission (): Promise<number>;

    // Used to get the actual swaps of the position.
    swaps (): Promise<number>;

    // Used to get the currency of the position.
    currency (): Promise<MidaCurrency>;

    // TODO: Used to cancel the position schedule.
    // cancelSchedule (): Promise<void>;

    // Used to close the position.
    close (): Promise<void>;
};

export function createPositionUUID (): string {
    return UUIDV1();
}
