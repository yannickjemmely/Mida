import { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";

export abstract class MidaIndicator {
    public abstract calculate (): Promise<any>;
    public abstract next (period: MidaSymbolPeriod): Promise<any>;
}
