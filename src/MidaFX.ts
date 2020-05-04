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
import { EMA } from "technicalindicators";
import {MidaTrendScalperA} from "#scalpers/MidaTrendScalperA";

export namespace MidaFX {
    
}

void (async (): Promise<void> => {
    console.log(await MidaTrendScalperA.calculate5MTrend());
    /*console.log(new EMA({
        period: 8,
        values: [
            1.0902,
            1.0902,
            1.0902,
            1.0900,
            1.0897,
            1.0896,
            1.0899,
            1.0902,
        ],
    }).result);*/
/*
    const myAccount: IMidaBroker = new BDSwissBroker();

    await myAccount.login({
        email: "vasile.peste@protonmail.ch",
        password: "b83c159fd52a5A",
        accountID: "6844385",
    });

    if (myAccount.loggedIn) {
        console.log("Logged in.");
    }

    const scalperA: MidaVolatileScalperA = new MidaVolatileScalperA({
        broker: myAccount,
        forexPair: MidaMarket.getForexPair("EUR/USD"),
    });

    scalperA.start();//*/
})();
