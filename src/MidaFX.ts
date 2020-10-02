import {EUR_USD, MidaForexPairType} from "#forex/MidaForexPairType";
import {MidaRunwayAdvisor} from "#advisors/runway/MidaRunwayAdvisor";
import {MidaForexPairExchangeRate} from "#forex/MidaForexPairExchangeRate";
import {MidaPlaygroundBroker} from "#broker/playground/MidaPlaygroundBroker";
import {MidaPositionStatusType} from "#position/MidaPositionStatusType";

export module MidaFX {
    
}

void (async (): Promise<void> => {
/*
    const myAccount: AMidaBroker = new BDSwissBroker();

    await myAccount.login({
        ID: "6844385",
        email: "vasile.peste@protonmail.ch",
        password: "b83c159fd52a5A",
    });

    const periods: MidaForexPairPeriod[] = await myAccount.getForexPairPeriods(EUR_USD, D1);
    const lastPeriods: MidaForexPairPeriod[] = periods.slice(periods.length - 15, periods.length);

    console.log("EUR/USD trend => " + MidaTA.calculateTrendV1(lastPeriods));

    const swingPointsLow: MidaSwingPoint[] = MidaTA.calculateSwingPointsV1(lastPeriods, MidaSwingPointType.LOW);


    for (const swingPointLow of swingPointsLow) {
        console.log(swingPointLow.priceMomentum);
        console.log(swingPointLow.lastPeriod);
    }



    /*


    const angles: number[] = [];

    for (let i: number = 0; i < last10Periods.length - 1; ++i) {
        const period: MidaForexPairPeriod = last10Periods[i];
        const nextPeriod: MidaForexPairPeriod = last10Periods[i + 1];

        console.log(period.close);

        angles.push(Math.atan2(nextPeriod.close - period.close, nextPeriod.time.valueOf() - period.time.valueOf()) * 180 / Math.PI);
    }

    console.log(angles);


*/
/*
// 1.01 ora
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

    for (const forexPair of advisorPairs) {
        const periods: MidaForexPairPeriod[] = await myAccount.getForexPairPeriods(forexPair, D1);
        const last30Periods: MidaForexPairPeriod[] = periods.slice(periods.length - 24, periods.length);

        console.log(forexPair.id + " trend = " + MidaTA.calculateTrendV1(last30Periods));

        console.log("\n\n\n\n");
    }



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


        await playground.addTime(60000 * 60 * 24 * 3);

        const adv: MidaRunwayAdvisor = new MidaRunwayAdvisor({
            broker: playground,
            forexPair: EUR_USD,
            operative: true,
        });

        await playground.addTime(60000 * 60 * 24 * 3);

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
