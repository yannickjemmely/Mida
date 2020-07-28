import {AMidaBroker} from "#broker/AMidaBroker";
import {BDSwissBroker} from "#broker/BDSwissBroker";

import {MidaForexPairType} from "#forex/MidaForexPairType";
import {MidaPrincepsAdvisor} from "#advisors/princeps/MidaPrincepsAdvisor";
import {MidaForexPair} from "#forex/MidaForexPair";
import {MidaAndrewAdvisor} from "#advisors/andrew/MidaAndrewAdvisor";
import {MidaRunwayAdvisor} from "#advisors/runway/MidaRunwayAdvisor";
import {MidaPositionDirectionType} from "#position/MidaPositionDirectionType";

export namespace MidaFX {
    
}

void (async (): Promise<void> => {
    const myAccount: AMidaBroker = new BDSwissBroker();

    await myAccount.login({
        ID: "6844385",
        email: "vasile.peste@protonmail.ch",
        password: "b83c159fd52a5A",
    });

    const advisorPairs: MidaForexPair[] = [
        MidaForexPairType.EUR_USD,
        MidaForexPairType.EUR_AUD,
        MidaForexPairType.EUR_CAD,
        MidaForexPairType.EUR_GBP,
        MidaForexPairType.USD_CAD,
        MidaForexPairType.GBP_USD,
        MidaForexPairType.GBP_AUD,
        MidaForexPairType.GBP_CAD,
        MidaForexPairType.GBP_CHF,
        MidaForexPairType.USD_JPY,
    ];

    const advisors: MidaPrincepsAdvisor[] = [];
    const andrewAdvisors: MidaAndrewAdvisor[] = [];
    const runwayAdvisors: MidaRunwayAdvisor[] = [];

    myAccount.openPosition({
        forexPair: MidaForexPairType.USD_JPY,
        direction: MidaPositionDirectionType.SELL,
        lots: 2,
    });

    for (const forexPair of advisorPairs) {

        advisors.push(new MidaPrincepsAdvisor({
            broker: myAccount,
            forexPair,
            operative: true,
        }));

        runwayAdvisors.push(new MidaRunwayAdvisor({
            broker: myAccount,
            forexPair,
            operative: true,
        }));
/*
        andrewAdvisors.push(new MidaAndrewAdvisor({
            broker: myAccount,
            forexPair,
            operative: true,
        }));*/
    }

    console.log("Operative.");
})();
