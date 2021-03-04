import puppeteer = require("puppeteer");
import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";

export class MetaBroker extends MidaBroker {
    private static readonly _WEB_META_TRADER_URI: string = "https://www.mql5.com/en/trading";

    public constructor (name: string) {
        super({
            name,
            websiteUri: "",
        });
    }

    public async login (...parameters: any[]): Promise<MidaBrokerAccount> {
        try {
            const browser: any = await puppeteer.launch();
            const metaTab: any = await browser.newPage();

            await metaTab.goto(MetaBroker._WEB_META_TRADER_URI);
        }
        catch (error) {
            throw new Error();
        }

        throw new Error();
    }

    private async _tryLoginFromTab (tab: any): Promise<boolean> {
        throw new Error();
    }
}
