import { MidaBroker } from "#brokers/MidaBroker";
import { MidaError } from "#errors/MidaError";

export class UnsupportedBrokerOperationError extends MidaError {
    private readonly _broker: MidaBroker;

    public constructor (broker: MidaBroker) {
        super("The broker does not support this operation.");

        this._broker = broker;
    }

    public get broker (): MidaBroker {
        return this._broker;
    }
}
