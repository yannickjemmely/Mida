import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrowser } from "#utilities/browser/MidaBrowser";
import { MidaBrowserTab } from "#utilities/browser/MidaBrowserTab";
import { MetaTraderBrokerParameters } from "!/plugins/meta-trader/MetaTraderBrokerParameters";

export class MetaTraderBroker extends MidaBroker {
    private static readonly _WEB_META_TRADER_URI: string = "https://trade.mql5.com/trade";

    private readonly _browser: MidaBrowser;

    public constructor ({ serverName, }: MetaTraderBrokerParameters) {
        super({
            name: serverName,
            websiteUri: "",
        });

        this._browser = new MidaBrowser();
    }

    public async login (...parameters: any[]): Promise<MidaBrokerAccount> {
        if (!this._browser.isOpen) {
            await this._browser.open();
        }

        try {
            //this._browser = await puppeteer.launch();
        }
        catch (error) {
            throw new Error();
        }

        const loggedPage: MidaBrowserTab = await this._createLoggedPage();
        const sessionDescriptor: any = await loggedPage.evaluate(`
            const descriptor = window.B.Oa.Xa.I;
            
            return {
                brokerName: descriptor.LI,
                currency: descriptor.Of,
                fullName: descriptor.Pg,
            };
        `);

        throw new Error();
    }

    private async _createLoggedPage (): Promise<any> {
        const loginButtonSelector: string = ".menu .box span div:nth-child(8)";
        const idBoxSelector: string = "#login";
        const passwordBoxSelector: string = "#password";
        const serverBoxSelector: string = "#server";
        let page: any;

        try {
            page = await this._browser.openTab();

            await page.goto(MetaTraderBroker._WEB_META_TRADER_URI);

            await page.click(loginButtonSelector);
            await page.click(loginButtonSelector);
            await page.click(loginButtonSelector);

            await page.type(idBoxSelector, "12345678");
            await page.type(passwordBoxSelector, "12345678");
            await page.type(serverBoxSelector, "ICMarketsEU-Live");
        }
        catch (error) {
            console.log(error);
        }

        return page;
    }
}
