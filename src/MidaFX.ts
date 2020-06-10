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
import {MidaAndrewAdvisor} from "#advisor/MidaAndrewAdvisor";
import {MidaUtilities} from "#utilities/MidaUtilities";
import {MidaUpperBandAdvisor} from "#advisor/MidaUpperBandAdvisor";

export namespace MidaFX {
    
}

void (async (): Promise<void> => {
    const myAccount: AMidaBroker = new BDSwissBroker();

    await myAccount.login({
        ID: "6844385",
        email: "vasile.peste@protonmail.ch",
        password: "b83c159fd52a5A",
    });
/*
    const a: MidaAndrewAdvisor = new MidaAndrewAdvisor({
        broker: myAccount,
        forexPair: MidaForexPairType.EUR_USD,
    });

    a.start();

    const b: MidaAndrewAdvisor = new MidaAndrewAdvisor({
        broker: myAccount,
        forexPair: MidaForexPairType.EUR_GBP,
    });

    b.start();

    const c: MidaAndrewAdvisor = new MidaAndrewAdvisor({
        broker: myAccount,
        forexPair: MidaForexPairType.USD_CAD,
    });

    c.start();

    const d: MidaAndrewAdvisor = new MidaAndrewAdvisor({
        broker: myAccount,
        forexPair: MidaForexPairType.GBP_CHF,
    });

    d.start();

    const trend: MidaSimpleTrendAdvisor = new MidaSimpleTrendAdvisor({
        broker: myAccount,
        forexPair: MidaForexPairType.EUR_USD,
    });

    trend.start();

    const trend2: MidaSimpleTrendAdvisor = new MidaSimpleTrendAdvisor({
        broker: myAccount,
        forexPair: MidaForexPairType.EUR_GBP,
    });

    trend2.start();
*/
    const trend3: MidaUpperBandAdvisor = new MidaUpperBandAdvisor({
        broker: myAccount,
        forexPair: MidaForexPairType.GBP_USD,
    });

    trend3.start();

    const trend4: MidaUpperBandAdvisor = new MidaUpperBandAdvisor({
        broker: myAccount,
        forexPair: MidaForexPairType.GBP_CHF,
    });

    trend4.start();

    const trend5: MidaUpperBandAdvisor = new MidaUpperBandAdvisor({
        broker: myAccount,
        forexPair: MidaForexPairType.USD_CAD,
    });

    trend5.start();

    console.log("Operative.");
})();
