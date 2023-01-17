import { MidaPositionParameters, } from "#positions/MidaPositionParameters";
import { MidaEmitter, } from "#utilities/emitters/MidaEmitter";
import { RestClient as OkxRestClient, } from "okx-api";

export type OkxPositionParameters = MidaPositionParameters & {
    restClient: OkxRestClient;
    internalEmitter: MidaEmitter;
};
