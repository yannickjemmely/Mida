import { MidaTradingAccountParameters, } from "#accounts/MidaTradingAccountParameters";

import { RestClient as OkxRestClient, WebsocketClient as OkxWsClient, } from "okx-api";

export type OkxAccountParameters = MidaTradingAccountParameters & {
    restClient: OkxRestClient;
    wsClient: OkxWsClient;
};
