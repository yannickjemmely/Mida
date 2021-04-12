import { MidaBrowser } from "#utilities/browser/MidaBrowser";
import { MidaBrowserTab } from "#utilities/browser/MidaBrowserTab";
import { MetaTraderBrokerLoginParameters } from "!plugins/metatrader/MetaTraderBrokerLoginParameters";
import { MetaTraderController } from "!plugins/metatrader/MetaTraderController";

export class MetaTrader {
    private static readonly _WEB_META_TRADER_URI: string = "https://trade.mql5.com/trade";

    private constructor () {
        // Silence is golden.
    }

    public static async login ({ id, password, serverName, version, }: MetaTraderBrokerLoginParameters): Promise<any> {
        const browser: MidaBrowser = new MidaBrowser();

        await browser.open();

        const browserTab: MidaBrowserTab = await browser.openTab();

        await browserTab.goto(MetaTrader._WEB_META_TRADER_URI);

        const metaTraderBrowserTab: MetaTraderController = new MetaTraderController(browserTab, version);

        await metaTraderBrowserTab.login({ id, password, serverName, version, });
    }
}
