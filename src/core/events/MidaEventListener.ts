import { MidaEvent } from "#events/MidaEvent";

export type MidaEventListener = ((event: MidaEvent) => any) | (() => any);
