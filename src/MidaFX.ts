import {AMidaBroker} from "src/broker/AMidaBroker";
import {BDSwissBroker} from "#broker/BDSwissBroker";


import {MidaForexPairType} from "#forex/MidaForexPairType";
import {MidaForexPairPeriodType} from "#forex/MidaForexPairPeriodType";
import {MidaBollingerTrendAdvisor} from "#advisors/bollinger-trend/MidaBollingerTrendAdvisor";
import {MidaForexPair} from "#forex/MidaForexPair";

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

    const advisors: MidaBollingerTrendAdvisor[] = [];

    for (const forexPair of advisorPairs) {
        const upperAdvisor: MidaBollingerTrendAdvisor = new MidaBollingerTrendAdvisor({
            broker: myAccount,
            forexPair,
        });

        advisors.push(upperAdvisor);
        upperAdvisor.start();
    }

    console.log("Operative.");
})();
