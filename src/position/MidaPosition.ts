import { v1 as UUIDV1 } from "uuid";
import { MidaCurrency } from "#currency/MidaCurrency";
import { MidaPositionDirectives } from "#position/MidaPositionDirectives";
import { MidaPositionStatusType } from "#position/MidaPositionStatusType";

export type MidaPosition = {
    // Represents a universally unique identifier of the position.
    UUID: string;

    // Represents the position directives.
    directives: MidaPositionDirectives;

    // Represents the position status.
    status: MidaPositionStatusType;

    // Represents the time the position representation has been created.
    date: Date;

    // Represents the time the position has been opened.
    openDate: Date;

    // Represents the quote currency price at the position open time.
    openPrice: number;

    // Represents the time the position has been closed.
    closeDate?: Date;

    // Represents the quote currency price at the position close time.
    closePrice?: number;

    // Represents the actual profit of the position.
    profit: number;

    // Represents the currency of the position profit.
    profitCurrency: MidaCurrency;

    // Represents the name of the broker used to open the position.
    brokerName: string;

    // Used to update the position.
    update (): Promise<MidaPosition>;

    // Used to close the position.
    close (): Promise<boolean>;
};

export function createPositionUUID (): string {
    return UUIDV1();
}
