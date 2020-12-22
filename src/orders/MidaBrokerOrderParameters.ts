import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";

// Represents the parameters of the order constructor.
export type MidaBrokerOrderParameters = {
    ticket: number;
    directives: MidaBrokerOrderDirectives;
};
