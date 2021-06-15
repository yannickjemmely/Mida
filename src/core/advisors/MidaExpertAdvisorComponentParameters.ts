import { MidaExpertAdvisor } from "#advisors/MidaExpertAdvisor";

export type MidaExpertAdvisorComponentParameters = {
    expertAdvisor: MidaExpertAdvisor;
    requiredComponents?: string[];
    uniquePerAdvisor?: boolean;
};
