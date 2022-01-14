import { MidaBrokerPositionDirection } from "#positions/MidaBrokerPositionDirection";

export type MidaBrokerPositionHistory = {
    directions: MidaBrokerPositionDirection[];
    openVolume: number;
};
