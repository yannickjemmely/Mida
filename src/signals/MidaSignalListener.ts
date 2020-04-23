import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaSignal } from "#signals/MidaSignal";

// Represents a signal listener.
export type MidaSignalListener = {
    // Represents a list of listened forex pairs.
    forexPairs?: MidaForexPair[];

    // Used to notify the listener when a signal occurs.
    notify (signal: MidaSignal): Promise<void> | void;
};
