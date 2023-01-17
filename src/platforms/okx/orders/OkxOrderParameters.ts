import { MidaOrderParameters, } from "#orders/MidaOrderParameters";
import { MidaEmitter, } from "#utilities/emitters/MidaEmitter";
import { RestClient as OkxRestClient, } from "okx-api";

export type OkxOrderParameters = MidaOrderParameters & {
    restClient: OkxRestClient;
    internalEmitter: MidaEmitter;
};
