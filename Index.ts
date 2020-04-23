


require("module-alias/register");
import {MidaPredictor} from "#predictor/MidaPredictor";
import {MidaForexPair} from "#forex/MidaForexPair";
import {MidaPositionDirectionType} from "#position/MidaPositionDirectionType";

import {MidaSignal} from "#signals/MidaSignal";
import {MidaTower} from "#signals/MidaTower";

import { MidaMarket } from "#market/MidaMarket";

import { BDSwissBroker } from "#brokers/bdswiss/BDSwissBroker";

void (async (): Promise<void> => {

    const myAccount: BDSwissBroker = new BDSwissBroker();

    const loggedIn: boolean = await myAccount.login({
        email: "vasile.peste@protonmail.ch",
        password: "b83c159fd52a5A",
        accountID: "6844385",
    });

    if (loggedIn) {
        await myAccount.openPosition({
            forexPair: MidaMarket.getForexPair("EUR/USD"),
            direction: MidaPositionDirectionType.BUY,
            lots: 1,
        });
    }

    console.log("Position has been opened.");

    setInterval(async (): Promise<void> => {
        console.log(await myAccount.getOpenPositions());
    }, 5000);
/*
    MidaPredictor.predictCurrencyStrengthDirection("USD").then((a:any):any => console.log("USD => " + a));
    MidaPredictor.predictCurrencyStrengthDirection("EUR").then((a:any):any => console.log("EUR => " + a));//*/
/*
    console.log(5);

    MidaTower.addTelegramSpy({
        name: "Me",
        channelID: "c1436688109_3888441384820971484",
        parse (text: string): MidaSignal | null {
            const lines: string[] = text.split("\n");

            if (lines.length !== 5) {
                return null;
            }

            const firstLineParts: string[] = lines[0].split(" ");

            if (!firstLineParts[0] || !firstLineParts[1]) {
                return null;
            }

            let direction: MidaPositionDirectionType;

            if (firstLineParts[0].toLowerCase() === "sell") {
                direction = MidaPositionDirectionType.SELL;
            }
            else if (firstLineParts[0].toLowerCase() === "buy") {
                direction = MidaPositionDirectionType.BUY;
            }
            else {
                return null;
            }

            const takeProfit: number = parseFloat(lines[1].split(" ")[4]);
            const stopLoss: number = parseFloat(lines[4].split(" ")[3]);

            if (isNaN(takeProfit) || isNaN(stopLoss)) {
                return null;
            }

            const forexPair: MidaForexPair = MidaMarket.getForexPair(firstLineParts[1]);

            return {
                date: new Date(),
                directives: {
                    forexPair,
                    direction,
                    lots: 1,
                    takeProfit,
                    stopLoss,
                },
            };
        },
    });

    MidaTower.addSignalListener({
        notify (signal: MidaSignal): void {
            console.log("Eccoci");
            myAccount.openPosition(signal.directives);
        },
    });





    MidaTower.enabled = true;

   /* console.log(await Promise.all([
        MidaPredictor.predictCurrencyStrengthDirection("CAD"),
        MidaPredictor.predictCurrencyStrengthDirection("USD"),
    ]));//*/
})();
