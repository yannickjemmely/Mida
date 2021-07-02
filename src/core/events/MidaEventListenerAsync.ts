import { MidaEvent } from "#events/MidaEvent";

export type MidaEventListenerAsync = ((event: MidaEvent) => Promise<any>) | (() => Promise<any>);
