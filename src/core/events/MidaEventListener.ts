import { MidaEvent } from "#events/MidaEvent";

/** Represents an event listener. */
export type MidaEventListener = ((event: MidaEvent) => any) | (() => any);
