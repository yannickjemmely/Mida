import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaSymbolPeriod } from "#/periods/MidaSymbolPeriod";

export abstract class MidaIndicator {
    public abstract async onTick (tick: MidaSymbolTick): Promise<void>;

    public abstract async onPeriod (period: MidaSymbolPeriod): Promise<void>;

    public get computed (): number[] {
        return [];
    }
}
