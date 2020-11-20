import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { IMidaBrowser } from "#browsers/IMidaBrowser";
import { IMidaBrowserTab } from "#browsers/IMidaBrowserTab";
import { ChromiumBrowser } from "#browsers/chromium/ChromiumBrowser";
import { MidaBrokerAccountType } from "#brokers/MidaBrokerAccountType";
import { BdSwissBrokerAccount } from "#brokers/bdswiss/BdSwissBrokerAccount";

export class BdSwissBroker extends MidaBroker {
    // Represents the broker name.
    public static readonly NAME: string = "BDSwiss";

    // Represents the broker browser used internally to navigate the website.
    private readonly _browser: IMidaBrowser;

    // Represents the broker browser tabs used to perform actions on the website.
    private readonly _browserTabs: {
        [name: string]: IMidaBrowserTab;
    };

    public constructor () {
        super(BdSwissBroker.NAME);

        this._browser = new ChromiumBrowser();
        this._browserTabs = {};
    }

    public async login (account: any): Promise<MidaBrokerAccount> {
        await this._browser.open();

        const loginTab: IMidaBrowserTab = await this._browser.openTab();
        const loginUri: string = "https://dashboard.bdswiss.com/login";
        const emailInputSelector: string = "#email";
        const passwordInputSelector: string = "#password";
        const loginButtonSelector: string = "header + div > div:last-child > div:last-child button:last-child";
        const accountSidebarSelector: string = ".sidebar";

        await loginTab.goto(loginUri);
        await loginTab.waitForSelector(`${emailInputSelector},${passwordInputSelector}`);
        await loginTab.type(emailInputSelector, account.email);
        await loginTab.type(passwordInputSelector, account.password);
        await loginTab.click(loginButtonSelector);
        await loginTab.waitForSelector(accountSidebarSelector);

        const isLoggedIn: boolean = await loginTab.evaluate(`window.location.href === "https://dashboard.bdswiss.com/accounts`);
        const name: string = await loginTab.evaluate(`window.document.querySelector(".sidebar > div:first-child > p:first-child").innerText.trim();`);

        if (!isLoggedIn) {
            throw new Error();
        }

        await loginTab.close();

        this._browserTabs.tradeTab = await this._openTradeTab(account.id);

        const accountType: MidaBrokerAccountType = await this._getAccountType();

        return new BdSwissBrokerAccount(account.id, name, accountType, this);
    }

    private async _openTradeTab (accountId: string): Promise<IMidaBrowserTab> {
        const tradeTab: IMidaBrowserTab = await this._browser.openTab();

        await tradeTab.goto(`https://trade.bdswiss.com/?embedded=true&login=${accountId}`);

        return tradeTab;
    }

    private async _getAccountType (): Promise<MidaBrokerAccountType> {
        await this._browserTabs.tradeTab.waitForSelector(".account__name");

        const plainAccountType: string = await this._browserTabs.tradeTab.evaluate(`window.document.querySelectorAll(".account__name")[0].innerText.trim()`);

        if (plainAccountType === "Practice Account") {
            return MidaBrokerAccountType.DEMO;
        }

        return MidaBrokerAccountType.REAL;
    }
}

