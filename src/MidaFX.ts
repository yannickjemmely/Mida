import {EUR_USD} from "#forex/MidaForexPairType";
import {M30, MidaForexPairPeriodType} from "#forex/MidaForexPairPeriodType";
import {MidaForexPairPeriod} from "#forex/MidaForexPairPeriod";
import {AMidaBroker} from "#broker/AMidaBroker";
import {BDSwissBroker} from "#broker/BDSwissBroker";

export module MidaFX {
    
}

void (async (): Promise<void> => {

    const myAccount: AMidaBroker = new BDSwissBroker();

    await myAccount.login({
        ID: "6844385",
        email: "vasile.peste@protonmail.ch",
        password: "b83c159fd52a5A",
    });

    const periods: MidaForexPairPeriod[] = await myAccount.getForexPairPeriods(EUR_USD, M30);

    periods.reverse();

    console.log(periods);

    /*


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

*/

    /*

    const advisors: MidaPrincepsAdvisor[] = [];
    const andrewAdvisors: MidaAndrewAdvisor[] = [];
    const runwayAdvisors: MidaRunwayAdvisor[] = [];

    for (const forexPair of advisorPairs) {

        myAccount.addForexPairTickListener(forexPair, (exchangeRate: MidaForexPairExchangeRate): void => {
            console.log(forexPair.id + " " + forexPair.countPips(exchangeRate.spread) + " pips");
            console.log(exchangeRate.spread);
            console.log("\n\n");
        });*/
/*
        advisors.push(new MidaPrincepsAdvisor({
            broker: myAccount,
            forexPair,
            operative: true,
        }));*/
/*
        const adv: MidaRunwayAdvisor = new MidaRunwayAdvisor({
            broker: myAccount,
            forexPair,
            operative: true,
        });

        runwayAdvisors.push(adv);

        adv.addEventListener(MidaAdvisorEventType.POSITION_CLOSE, (position: MidaPosition): void => {
            position.profit().then((profit: number): void => {
                console.log("Closed " + position.directives.forexPair.ID + " with profit " + profit);
            });
        });*/
/*
        andrewAdvisors.push(new MidaAndrewAdvisor({
            broker: myAccount,
            forexPair,
            operative: true,
        }));*/
   /* }*/















/*



    const playground: MidaPlaygroundBroker = new MidaPlaygroundBroker();

    const fs: any = require("fs");
    const path: string = "series/EURUSD/ticks/2019/01.csv";

    const lines: string = fs.readFileSync(path).toString().split("\n");

    const ticks: MidaForexPairExchangeRate[] = [];

    for (const line of lines) {
        const parts: string[] = line.split(",");

        ticks.push({
            forexPair: MidaForexPairType.EUR_USD,
            time: new Date(parts[0]),
            bid: parseFloat(parts[1]),
            ask: parseFloat(parts[2]),
            spread: parseFloat(parts[2]) - parseFloat(parts[1]),
        });
    }

    playground.loadTicks(ticks);


    try {
        playground.addForexPairTickListener(MidaForexPairType.EUR_USD, (exchangeRate: MidaForexPairExchangeRate): void => {
            //console.log(exchangeRate);
        });

        await playground.addTime(60000 * 60 * 24 * 3);

        const adv: MidaRunwayAdvisor = new MidaRunwayAdvisor({
            broker: playground,
            forexPair: EUR_USD,
            operative: true,
        });

        await playground.addTime(60000 * 60 * 24 * 6);

        let profit: number = 0;
        let positive: number = 0;
        let negative: number = 0;
        let total: number = adv.positions.length;

        for (const position of adv.positions) {
            const posProf: number = await position.profit();

            if (posProf > 0) {
                ++positive;
            }
            else if (posProf < 0) {
                ++negative;
            }

            profit += posProf;
        }

        console.log("total profit " + profit);
        console.log("total positions " + total);
        console.log("positive positions: " + positive);
        console.log("negative positions: " + negative);
    }
    catch (error) {
        console.log(error);
    }//*/
})();
