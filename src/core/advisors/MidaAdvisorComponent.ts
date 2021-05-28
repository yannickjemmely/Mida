import { MidaAdvisor } from "#advisors/MidaAdvisor";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";

export abstract class MidaAdvisorComponent {
    private readonly _advisor: MidaAdvisor;

    protected constructor ({ advisor, }: any) {
        this._advisor = advisor;
    }

    protected abstract onTick (tick: MidaSymbolTick): void;
}
