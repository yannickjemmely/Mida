import { IMidaBroker } from "#brokers/IMidaBroker";
import { MidaForexPair } from "#forex/MidaForexPair";

export type MidaScalperOptions = {
    broker: IMidaBroker;

    forexPair: MidaForexPair;


    maxPositions: number;/*

    minPositionProfit: number;

    maxPositionLoss: number;

    maxPositionTime: number;*/
};
