import { MidaExpertAdvisor } from "#advisors/MidaExpertAdvisor";
import { MidaExpertAdvisorComponentParameters } from "#advisors/MidaExpertAdvisorComponentParameters";
import { MidaSymbolTick } from "#ticks/MidaSymbolTick";

export abstract class MidaExpertAdvisorComponent {
    readonly #expertAdvisor: MidaExpertAdvisor;
    readonly #requiredComponents: string[];
    readonly #uniquePerAdvisor: boolean;
    #enabled: boolean;

    protected constructor ({
        expertAdvisor,
        requiredComponents = [],
        uniquePerAdvisor = false,
    }: MidaExpertAdvisorComponentParameters) {
        this.#expertAdvisor = expertAdvisor;
        this.#requiredComponents = requiredComponents;
        this.#uniquePerAdvisor = uniquePerAdvisor;
        this.#enabled = false;
    }

    public get expertAdvisor (): MidaExpertAdvisor {
        return this.#expertAdvisor;
    }

    public get requiredComponents (): readonly string[] {
        return this.#requiredComponents;
    }

    public get uniquePerAdvisor (): boolean {
        return this.#uniquePerAdvisor;
    }

    public get enabled (): boolean {
        return this.#enabled;
    }

    public set enabled (value: boolean) {
        this.#enabled = value;
    }

    public abstract configure (): Promise<void>;

    public onTick (tick: MidaSymbolTick): void {
        // Silence is golden.
    }

    public onLateTick (tick: MidaSymbolTick): void {
        // Silence is golden.
    }
}
