import {IMidaBroker} from "#brokers/IMidaBroker";
import {BDSwissBroker} from "#brokers/BDSwissBroker";
import {MidaPosition} from "#position/MidaPosition";
import {MidaMarket} from "#market/MidaMarket";
import {MidaPositionDirectionType} from "#position/MidaPositionDirectionType";
import {MidaForexPair} from "#forex/MidaForexPair";
import {MidaPatternAnalysis} from "#utilities/MidaPatternAnalysis";
import {MidaUtilities} from "#utilities/MidaUtilities";
import {AMidaScalper} from "#scalpers/AMidaScalper";
import {AlphaVantage} from "#utilities/AlphaVantage";
import { EMA, RSI, BollingerBands, Stochastic } from "technicalindicators";
//import {MidaTFScalper} from "#scalpers/MidaTFScalper";
import {MidaForexPairPeriod} from "#forex/MidaForexPairPeriod";

import {MidaBollingerScalper} from "#scalpers/MidaBollingerScalper";
import {MidaEconomist} from "#factors/MidaEconomist";
import {MidaPredictor} from "#predictor/MidaPredictor";

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

    const scalperA: AMidaScalper = new MidaBollingerScalper({
        broker: myAccount,
        forexPair: MidaMarket.getForexPair("EUR/USD"),
    });

    const scalperB: AMidaScalper = new MidaBollingerScalper({
        broker: myAccount,
        forexPair: MidaMarket.getForexPair("EUR/GBP"),
    });

    const scalperC: AMidaScalper = new MidaBollingerScalper({
        broker: myAccount,
        forexPair: MidaMarket.getForexPair("GBP/CAD"),
    });

    const scalperD: AMidaScalper = new MidaBollingerScalper({
        broker: myAccount,
        forexPair: MidaMarket.getForexPair("USD/JPY"),
    });

    scalperA.start();
    scalperB.start();
    scalperC.start();
    scalperD.start();
})();
