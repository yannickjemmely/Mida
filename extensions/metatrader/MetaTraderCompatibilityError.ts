import { MidaError } from "#errors/MidaError";

export class MetaTraderUnsupportedError extends MidaError {
    public constructor () {
        super("The MetaTrader website interface has changed.");
    }
}
