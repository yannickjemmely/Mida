import { IMidaBrowserTab } from "#browsers/IMidaBrowserTab";
import { ChromiumBrowser } from "#browsers/ChromiumBrowser";
import { MidaForexPair } from "#forex/MidaForexPair";

export class MidaAnalysisScraper {
    private constructor () {
        // Silence is golden.
    }

    private static async fetchForexPairForecasts (forexPair: MidaForexPair): Promise<any[]> {
        return [];
    }
}
