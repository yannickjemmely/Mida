import { MidaExpertAdvisor } from "#advisors/MidaExpertAdvisor";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";

/**
 * The expert advisor constructor parameters
 * @see MidaExpertAdvisor
 */
export type MidaExpertAdvisorParameters = {
    brokerAccount: MidaBrokerAccount;
};
