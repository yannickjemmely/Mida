import { MidaAssetPair } from "#assets/MidaAssetPair";
import { AMidaBroker } from "#brokers/AMidaBroker";
import { MidaCurrency } from "#currencies/MidaCurrency";
import { MidaPositionDirectives } from "#positions/MidaPositionDirectives";
import { MidaPositionStatusType } from "#positions/MidaPositionStatusType";
import { MidaPositionType } from "#positions/MidaPositionType";

// Represents a position.
export class MidaPosition {
    private readonly _id: string;

    private readonly _broker: AMidaBroker;

    private readonly _directives: MidaPositionDirectives;

    public constructor (id: string, broker: AMidaBroker, directives: MidaPositionDirectives) {
        this._id = id;
        this._broker = broker;
        this._directives = { ...directives, };
    }

    public get id (): string {
        return this._id;
    }

    public get broker (): AMidaBroker {
        return this._broker;
    }

    public get assetPair (): MidaAssetPair {
        return this._directives.assetPair;
    }

    public get type (): MidaPositionType {
        return this._directives.type;
    }

    public get lots (): number {
        return this._directives.lots;
    }

    public async getStatus (): Promise<MidaPositionStatusType> {
        throw new Error();
    }

    public async getLots (): Promise<number> {
        throw new Error();
    }

    public async getStopLoss (): Promise<number | undefined> {
        throw new Error();
    }

    public async setStopLoss (stopLoss: number): Promise<void> {
        this._directives.stopLoss = stopLoss;

        throw new Error();
    }

    public async getTakeProfit (): Promise<number | undefined> {
        throw new Error();
    }

    public async setTakeProfit (takeProfit: number): Promise<void> {
        this._directives.takeProfit = takeProfit;

        throw new Error();
    }

    public async getProfit (): Promise<number> {
        throw new Error();
    }

    public async getCommision (): Promise<number> {
        throw new Error();
    }

    public async getSwaps (): Promise<number> {
        throw new Error();
    }

    public async getCurrency (): Promise<MidaCurrency> {
        throw new Error();
    }

    public async getLeverage (): Promise<undefined> {
        throw new Error();
    }

    public async close (): Promise<void> {
        throw new Error();
    }
}

/*
// Represents a position.
export type MidaPosition = {
    // Represents the position universally unique identifier.
    readonly uuid: string;

    // Represents a piece of information about the broker used to open the position.
    broker: {
        // Represents the name of the broker.
        name: string;

        // Represents the broker account ID.
        accountId: string;

        // Represents the broker position ID.
        positionId: string;
    };

    // Represents the position directives.
    directives: MidaPositionDirectives;

    // Represents the position status.
    status: MidaPositionStatusType;

    // Represents the position open date.
    openDate: Date;

    // Represents the position open price.
    openPrice: number;

    // Represents the position close date.
    closeDate: Date | null;

    // Represents the position close price.
    closePrice: number | null;

    // Represents the lowest position profit.
    lowestProfit?: number;

    // Represents the highest position profit.
    highestProfit?: number;

    // Used to get the actual profit of the position.
    profit (): Promise<number>;

    // Used to get the actual commission of the position.
    commission (): Promise<number>;

    // Used to get the actual swaps of the position.
    swaps (): Promise<number>;

    // Used to get the currency of the position.
    currency (): Promise<MidaCurrency>;

    // TODO: Used to cancel the position schedule.
    // cancelSchedule (): Promise<void>;

    // Used to close the position.
    close (): Promise<void>;
};
*/
