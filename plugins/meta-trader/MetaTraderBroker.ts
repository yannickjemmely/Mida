import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrowser } from "#utilities/browser/MidaBrowser";
import { MidaBrowserTab } from "#utilities/browser/MidaBrowserTab";

export class MetaTraderBroker extends MidaBroker {
    private static readonly _WEB_META_TRADER_URI: string = "https://trade.mql5.com/trade";

    private _browser: any;

    public constructor (name: string) {
        super({
            name,
            websiteUri: "",
        });
    }

    public async login (...parameters: any[]): Promise<MidaBrokerAccount> {
        try {
            //this._browser = await puppeteer.launch();
        }
        catch (error) {
            throw new Error();
        }

        throw new Error();
    }

    private async _createLoggedPage (): Promise<any> {
        const loginButtonSelector: string = ".menu .box span div:nth-child(8)";
        const idBoxSelector: string = "#login";
        const passwordBoxSelector: string = "#password";
        const serverBoxSelector: string = "#server";
        let page: any;

        try {
            page = await this._browser.newPage();

            await page.goto(MetaTraderBroker._WEB_META_TRADER_URI);

            await page.click(loginButtonSelector);
            await page.click(loginButtonSelector);
            await page.click(loginButtonSelector);

            await page.type(idBoxSelector, "12345678");
            await page.type(passwordBoxSelector, "12345678");
            await page.type(serverBoxSelector, "ICMarketsEU-Live");
        }
        catch (error) {
            // Silence is golden.
        }

        return page;
    }
}
