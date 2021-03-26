import { MidaError } from "#errors/MidaError";

export class MetaTraderUnsupportedError extends MidaError {
    public constructor () {
        super(`The web MetaTrader interface has changed: APIs must be adapted to the new interface.`);
    }
}
