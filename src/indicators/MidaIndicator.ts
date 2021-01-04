import { MidaSymbolTick } from "#ticks/MidaSymbolTick";
import { MidaSymbolPeriod } from "#/periods/MidaSymbolPeriod";

export abstract class MidaIndicator {
    private readonly _computed: any;

    public abstract async onTick (tick: MidaSymbolTick): Promise<void>;

    public abstract async onPeriod (period: MidaSymbolPeriod): Promise<void>;

    public abstract async compute (...parameters: any): Promise<any>;
}
