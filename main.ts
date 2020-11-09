require("module-alias/register");
//require("#/MidaFX");

import { MidaAsset } from "#assets/MidaAsset";
import { MidaAssetPeriod } from "#assets/MidaAssetPeriod";
import { MidaAssetQuotation } from "#assets/MidaAssetQuotation";
import { MidaAssetPeriodType } from "#assets/MidaAssetPeriodType";

const asset: MidaAsset = new MidaAsset("NGAS");

const periods: any = MidaAssetPeriod.fromQuotations([
        new MidaAssetQuotation(
            asset,
            new Date("2020-11-08T20:07:02.000Z"),
            0,
            0,
        ),
        new MidaAssetQuotation(
            asset,
            new Date("2020-11-08T20:07:03.000Z"),
            0,
            0,
        ),
        new MidaAssetQuotation(
            asset,
            new Date("2020-11-08T20:07:08.000Z"),
            0,
            0,
        ),
            new MidaAssetQuotation(
                asset,
                new Date("2020-11-08T20:20:08.000Z"),
                0,
                0,
            ),
            new MidaAssetQuotation(
                asset,
                new Date("2020-11-08T20:22:08.000Z"),
                0,
                0,
            ),
            new MidaAssetQuotation(
                asset,
                new Date("2020-11-08T20:36:08.000Z"),
                0,
                0,
            ),
            new MidaAssetQuotation(
                asset,
                new Date("2020-11-08T21:07:08.000Z"),
                0,
                0,
            ),
],
    new Date("2020-11-08T20:00:00.000Z"),
    MidaAssetPeriodType.W1);

console.log(periods.length);

/*
const fs: any = require("fs");
const path: string = "series/EURUSD/ticks/2019/01.csv";

const lines: string = fs.readFileSync(path).toString().split("\n");
let sanitized: string = "";

for (let i: number = 0; i < lines.length - 1; ++i) {
    const line: string = lines[i];
    const parts: string[] = line.split(",");
    const date: string = parts[0].split(" ")[0];
    const time: string = parts[0].split(" ")[1];

    const dateTime: Date = new Date(date.substr(0, 4) + "-" + date.substr(4, 2) + "-" + date.substr(6, 2) + "T" + time.substr(0, 2) + ":" + time.substr(2, 2) + ":" + time.substr(4, 2) + "." + time.substr(6, 3) + "Z");

    sanitized += `${dateTime.toISOString()},${parts[1]},${parts[2]},${parts[3]}\n`;
}

fs.writeFileSync("series/EURUSD/ticks/2019/01a.csv", sanitized);
//*/
