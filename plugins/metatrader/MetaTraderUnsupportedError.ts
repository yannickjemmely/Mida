import { MidaError } from "#errors/MidaError";

export class MetaTraderUnsupportedError extends MidaError {
    private readonly _server: string;

    public constructor (server: string) {
        super(`The server "${server}" has not enabled Web MetaTrader.`);

        this._server = server;
    }

    public get server (): string {
        return this._server;
    }
}
