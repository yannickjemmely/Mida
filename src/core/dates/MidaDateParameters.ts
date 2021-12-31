import { MidaDate } from "#dates/MidaDate";

/**
 * The date constructor parameters.
 * @see MidaDate
 */
export type MidaDateParameters = {
    timestamp?: number;
    iso?: string;
    date?: MidaDate | Date;
};
