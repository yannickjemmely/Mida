import { MidaPositionDirectives } from "#position/MidaPositionDirectives";

// Represents a signal on a position.
export type MidaSignal = {
    // Represents the time of the signal.
    date: Date;

    // Represents the directives of the signal.
    directives: MidaPositionDirectives;

    // Represents the name of the signal sender.
    sender?: string;
};
