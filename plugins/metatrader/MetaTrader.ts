import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrowser } from "#utilities/browser/MidaBrowser";
import { MidaBrowserTab } from "#utilities/browser/MidaBrowserTab";
import { MetaTraderBrokerLoginParameters } from "!plugins/metatrader/MetaTraderBrokerLoginParameters";

export class MetaTrader {
    private static readonly _WEB_META_TRADER_URI: string = "https://trade.mql5.com/trade";

    private constructor () {
        // Silence is golden.
    }

    public static async login ({ id, password, serverName, }: MetaTraderBrokerLoginParameters): Promise<MidaBrokerAccount> {
        const browser: MidaBrowser = new MidaBrowser();

        await browser.open();

        const loggedPage: MidaBrowserTab = await MetaTrader._createLoggedPage(browser);


        const sessionDescriptor: any = await loggedPage.evaluate(`
            const descriptor = window.B.Oa.Xa.I;
            
            return {
                brokerName: descriptor.LI,
                currency: descriptor.Of,
                ownerName: descriptor.Pg,
            };
        `);

        throw new Error();
    }

    private static async _createLoggedPage (browser: MidaBrowser): Promise<any> {
        const loginButtonSelector: string = ".menu .box span div:nth-child(8)";
        const idBoxSelector: string = "#login";
        const passwordBoxSelector: string = "#password";
        const serverBoxSelector: string = "#server";
        let page: any;
        let hasInterfaceChanged: boolean;

        try {
            page = await browser.openTab();

            await page.goto(MetaTrader._WEB_META_TRADER_URI);

            hasInterfaceChanged = await MetaTrader._hasLoggedPageApiChanged(page);
        }
        catch (error) {
            throw new Error();
        }

        if (hasInterfaceChanged) {
            throw new Error("Web MetaTrader API has changed.");
        }

        try {
            await page.click(loginButtonSelector);
            await page.click(loginButtonSelector);
            await page.click(loginButtonSelector);

            await page.type(idBoxSelector, "12345678");
            await page.type(passwordBoxSelector, "12345678");
            await page.type(serverBoxSelector, "ICMarketsEU-Live");
        }
        catch (error) {
            throw new Error();
        }

        return page;
    }

    private static async _hasLoggedPageInterfaceChanged (page: MidaBrowserTab): Promise<boolean> {
        try {
            return page.evaluate(`((w) => {
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
