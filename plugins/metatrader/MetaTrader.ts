import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrowser } from "#utilities/browser/MidaBrowser";
import { MidaBrowserTab } from "#utilities/browser/MidaBrowserTab";
import { MetaTraderBrokerLoginParameters } from "!plugins/metatrader/MetaTraderBrokerLoginParameters";
import { MetaTraderBrokerAccount } from "plugins/metatrader/MetaTraderBrokerAccount";
import { MetaTraderBroker } from "!plugins/metatrader/MetaTraderBroker";

export class MetaTrader {
    private static readonly _WEB_META_TRADER_URI: string = "https://trade.mql5.com/trade";

    private constructor () {
        // Silence is golden.
    }

    public static async login ({ id, password, serverName, version = 4, }: MetaTraderBrokerLoginParameters): Promise<any> {
        const browser: MidaBrowser = new MidaBrowser();

        await browser.open();

        const loggedPage: MidaBrowserTab = await MetaTrader._createLoggedPage(browser, id, password, serverName);
        const broker: MetaTraderBroker = new MetaTraderBroker({
            name: "",
            websiteUri: "",
        });
        
        /*
        return new MetaTraderBrokerAccount({
            id,
        });*/

        //throw new Error();
    }

    private static async _createLoggedPage (browser: MidaBrowser, id: string, password: string, serverName: string): Promise<MidaBrowserTab> {
        const loginButtonSelector: string = ".menu .box span div:nth-child(8)";
        const idBoxSelector: string = "#login";
        const passwordBoxSelector: string = "#password";
        const serverBoxSelector: string = "#server";
        const confirmButtonSelector: string = ".modal:not(.hidden) .w .b > button + button";
        const page: MidaBrowserTab = await browser.openTab();

        await page.goto(MetaTrader._WEB_META_TRADER_URI);

        try {
            // await page.waitForSelector(loginButtonSelector); // Required for MT5.
            // await page.click(loginButtonSelector, 4); // Required for MT5.

            await page.waitForSelector(`${idBoxSelector}, ${passwordBoxSelector}, ${serverBoxSelector}, ${confirmButtonSelector}`);
            await page.type(idBoxSelector, id);
            await page.type(passwordBoxSelector, password);
            await page.click(serverBoxSelector, 3);
            await page.type(serverBoxSelector, serverName);
            await page.click(confirmButtonSelector);
        }
        catch (error) {
            throw new Error();
        }

        return page;
    }
}
