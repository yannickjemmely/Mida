import {IMidaBroker} from "#brokers/IMidaBroker";
import {BDSwissBroker} from "#brokers/BDSwissBroker";
import {MidaPosition} from "#position/MidaPosition";
import {MidaMarket} from "#market/MidaMarket";
import {MidaPositionDirectionType} from "#position/MidaPositionDirectionType";
import {MidaForexPair} from "#forex/MidaForexPair";
import {MidaPatternAnalysis} from "#utilities/MidaPatternAnalysis";
import {MidaUtilities} from "#utilities/MidaUtilities";
import {MidaVolatileScalperA} from "#scalpers/MidaVolatileScalperA";
import {AMidaScalper} from "#scalpers/AMidaScalper";
import {AlphaVantage} from "#utilities/AlphaVantage";
import { EMA, RSI, BollingerBands, Stochastic } from "technicalindicators";
import {MidaEMTrendScalper} from "#scalpers/MidaEMTrendScalper";
import {MidaForexPairPeriod} from "#forex/MidaForexPairPeriod";


import {MidaEMSTBBScalper} from "#scalpers/MidaEMSTBBScalper";
import {MidaBBScalper} from "#scalpers/MidaBBScalper";

export namespace MidaFX {
    
}

void (async (): Promise<void> => {
    const myAccount: IMidaBroker = new BDSwissBroker();

    await myAccount.login({
        email: "vasile.peste@protonmail.ch",
        password: "b83c159fd52a5A",
        accountID: "6844385",
    });

    if (myAccount.isLoggedIn) {
        console.log("Logged in.");
    }

    const scalperA: AMidaScalper = new MidaBBScalper({
        broker: myAccount,
        forexPair: MidaMarket.getForexPair("EUR/USD"),
    });

    const scalperB: AMidaScalper = new MidaBBScalper({
        broker: myAccount,
        forexPair: MidaMarket.getForexPair("EUR/GBP"),
    });

    const scalperC: AMidaScalper = new MidaBBScalper({
        broker: myAccount,
        forexPair: MidaMarket.getForexPair("GBP/CAD"),
    });

    const scalperD: AMidaScalper = new MidaBBScalper({
        broker: myAccount,
        forexPair: MidaMarket.getForexPair("USD/JPY"),
    });

    scalperA.start();
    scalperB.start();
    scalperC.start();
    scalperD.start();
})();
