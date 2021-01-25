import { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";

export abstract class MidaIndicator {
    public abstract async calculate (): Promise<any>;
    public abstract async next (period: MidaSymbolPeriod): Promise<any>;
}
