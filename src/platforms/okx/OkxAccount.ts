import { OkxAccountParameters, } from "!/src/platforms/okx/OkxAccountParameters";
import { MidaTradingAccount, } from "#accounts/MidaTradingAccount";
import { MidaTick, } from "#ticks/MidaTick";

import { RestClient as OkxRestClient, WebsocketClient as OkxWsClient, } from "okx-api";

// @ts-ignore
export class OkxAccount extends MidaTradingAccount {
    readonly #restClient: OkxRestClient;
    readonly #wsClient: OkxWsClient;

    public constructor ({
        id,
        platform,
        creationDate,
        primaryAsset,
        operativity,
        positionAccounting,
        indicativeLeverage,
        restClient,
        wsClient,
    }: OkxAccountParameters) {
        super({
            id,
            platform,
            creationDate,
            primaryAsset,
            operativity,
            positionAccounting,
            indicativeLeverage,
        });

        this.#restClient = restClient;
        this.#wsClient = wsClient;
    }

    // @ts-ignore
    protected async getSymbolLastTick (symbol: string): Promise<MidaTick> {

    }
}
