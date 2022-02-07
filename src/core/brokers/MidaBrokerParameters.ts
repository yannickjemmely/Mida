import { MidaBroker } from "#brokers/MidaBroker";

/**
 * The broker constructor parameters
 * @see MidaBroker
 */
export type MidaBrokerParameters = {
    /** The broker name */
    name: string;
    /** The broker legal name */
    legalName: string;
    /** The broker website address */
    websiteUri: string;
};
