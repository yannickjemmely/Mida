import {AMidaBroker} from "src/broker/AMidaBroker";
import {BDSwissBroker} from "#broker/BDSwissBroker";
import {MidaPosition} from "#position/MidaPosition";
import {MidaPositionDirectionType} from "#position/MidaPositionDirectionType";
import {MidaForexPair} from "#forex/MidaForexPair";

import {MidaForexPairPeriod} from "#forex/MidaForexPairPeriod";


import {MidaForexPairType} from "#forex/MidaForexPairType";
import {MidaForexPairExchangeRate} from "#forex/MidaForexPairExchangeRate";
import {MidaBrokerEventType} from "#broker/MidaBrokerEventType";
import {MidaForexPairPeriodType} from "#forex/MidaForexPairPeriodType";
import { MidaTA } from "#/analysis/MidaTA";
import {AMidaAdvisor} from "#advisor/AMidaAdvisor";

export namespace MidaFX {
    
}

class MyAD extends AMidaAdvisor {
    public constructor (options: any) {
        super(options);
    }
}

void (async (): Promise<void> => {
    const myAccount: AMidaBroker = new BDSwissBroker();

    await myAccount.login({
        ID: "6844385",
        email: "vasile.peste@protonmail.ch",
        password: "b83c159fd52a5A",
    });
})();
