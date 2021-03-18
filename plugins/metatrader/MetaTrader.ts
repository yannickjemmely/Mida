import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrowser } from "#utilities/browser/MidaBrowser";
import { MidaBrowserTab } from "#utilities/browser/MidaBrowserTab";
import { MetaTraderBrokerLoginParameters } from "!plugins/metatrader/MetaTraderBrokerLoginParameters";
import { MetaTraderBrokerAccount } from "!plugins/metatrader/MetaTraderBrokerAccount";
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
        let page: any;

        try {
            page = await browser.openTab();

            await page.goto(MetaTrader._WEB_META_TRADER_URI);
        }
        catch (error) {
            throw new Error();
        }
/*
        if ((await MetaTrader._hasLoggedPageInterfaceChanged(page))) {
            throw new Error("Web MetaTrader API has changed.");
        }*/

        try {
            await page.waitForSelector(loginButtonSelector);
            await page.click(loginButtonSelector, 4);

            await page.waitForSelector(`${idBoxSelector}, ${passwordBoxSelector}, ${serverBoxSelector}`);
            await page.type(idBoxSelector, id);
            await page.type(passwordBoxSelector, password);
            await page.type(serverBoxSelector, serverName);
        }
        catch (error) {
            throw new Error();
        }

        return page;
    }

    private static async _hasLoggedPageInterfaceChanged (loggedPage: MidaBrowserTab): Promise<boolean> {
        try {
            return loggedPage.evaluate(`((w) => {
                return !(
                    window.B
                    && window.B.Oa
                    && window.B.Oa.Xa
                    && window.B.Oa.Xa.A
                    && window.B.Oa.Xa.A.ff
                    && window.B.Oa.Xa.A.history
                    && window.B.Oa.Xa.Nc
                    && window.B.Oa.Xa.Nc.Ea
                );
            })(window);`);
        }
        catch (error) {
            throw new Error();
        }
    }
}
