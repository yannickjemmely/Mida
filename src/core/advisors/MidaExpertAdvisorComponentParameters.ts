import { MidaExpertAdvisor } from "#advisors/MidaExpertAdvisor";
import { MidaExpertAdvisorComponent } from "#advisors/MidaExpertAdvisorComponent";

/**
 * The expert advisor component constructor parameters
 * @see MidaExpertAdvisorComponent
 */
export type MidaExpertAdvisorComponentParameters = {
    expertAdvisor: MidaExpertAdvisor;
    requiredComponents?: string[];
    uniquePerAdvisor?: boolean;
};
