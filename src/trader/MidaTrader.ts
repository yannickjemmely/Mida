import { AMidaBroker } from "#broker/AMidaBroker";

export class MidaTrader {
    private readonly _id: string;

    private readonly _broker: AMidaBroker;

    public constructor (id: string, broker: AMidaBroker) {
        this._id = id;
        this._broker = broker;
    }

    public get id (): string {
        return this._id;
    }

    public get broker (): AMidaBroker {
        return this._broker;
    }
}
