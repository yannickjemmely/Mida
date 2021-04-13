import { MidaBrowser } from "#utilities/browsers/MidaBrowser";
import { MidaBrowserTab } from "#utilities/browsers/MidaBrowserTab";
import { MetaTraderBrokerLoginParameters } from "&metatrader/MetaTraderBrokerLoginParameters";
import { MetaTraderController } from "&metatrader/MetaTraderController";

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
