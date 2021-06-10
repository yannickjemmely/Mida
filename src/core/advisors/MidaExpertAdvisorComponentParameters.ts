import { MidaExpertAdvisor } from "#advisors/MidaExpertAdvisor";
import { MidaExpertAdvisorComponent } from "#advisors/MidaExpertAdvisorComponent";

export type MidaExpertAdvisorComponentParameters = {
    expertAdvisor: MidaExpertAdvisor;
    requiredComponents?: typeof MidaExpertAdvisorComponent[];
    uniquePerAdvisor?: boolean;
};
