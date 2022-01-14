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

    public get requiredComponents (): string[] {
        return [ ...this.#requiredComponents, ];
    }

    public get uniquePerAdvisor (): boolean {
        return this.#uniquePerAdvisor;
    }

    public get enabled (): boolean {
        return this.#enabled;
    }

    public set enabled (enabled: boolean) {
        this.#enabled = enabled;
    }

    public abstract configure (): Promise<void>;

    public async onTick (tick: MidaSymbolTick): Promise<void> {
        // Silence is golden.
    }

    public async onLateTick (tick: MidaSymbolTick): Promise<void> {
        // Silence is golden.
    }
}
