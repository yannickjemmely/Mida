import { MidaTrade, } from "#trades/MidaTrade";
import { OkxTradeParameters, } from "!/src/platforms/okx/trades/OkxTradeParameters";

export class OkxTrade extends MidaTrade {
    public constructor (parameters: OkxTradeParameters) {
        super(parameters);
    }
}
