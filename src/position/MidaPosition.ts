import { MidaPositionDirectives } from "#position/MidaPositionDirectives";
import { MidaPositionStatusType } from "#position/MidaPositionStatusType";

export type MidaPosition = {
    // Represents the position directives.
    directives: MidaPositionDirectives;

    // Represents the position status.
    status: MidaPositionStatusType;

    // Represents the time the position representation has been created.
    date: Date;

    // Represents the quote currency price at the position open time.
    openPrice: number;

    // Represents the time the position has been opened.
    openDate: Date;

    // Represents the quote currency price at the position close time.
    closePrice?: number;

    // Represents the time the position has been closed.
    closeDate?: Date;

    // Represents the actual profit of the position.
    profit: number;

    // Used to close the position.
    close (): Promise<boolean>;
};
