// Represents an indicator.
export interface IMidaIndicator {
    compute (...parameters: any[]): Promise<any>;

    next (...parameters: any[]): Promise<any>;
}
