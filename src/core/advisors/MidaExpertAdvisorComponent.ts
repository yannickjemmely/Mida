import { MidaExpertAdvisor } from "#advisors/MidaExpertAdvisor";
import { MidaExpertAdvisorComponentParameters } from "#advisors/MidaExpertAdvisorComponentParameters";

export abstract class MidaExpertAdvisorComponent {
    readonly #expertAdvisor: MidaExpertAdvisor;
    #enabled: boolean;

    protected constructor ({ expertAdvisor, }: MidaExpertAdvisorComponentParameters) {
        this.#expertAdvisor = expertAdvisor;
        this.#enabled = false;
    }

    public get expertAdvisor (): MidaExpertAdvisor {
        return this.#expertAdvisor;
    }

    public get enabled (): boolean {
        return this.#enabled;
    }

    public set enabled (value: boolean) {
        this.#enabled = value;
    }
}
