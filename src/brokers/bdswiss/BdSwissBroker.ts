import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { IMidaBrowser } from "#browsers/IMidaBrowser";
import { IMidaBrowserTab } from "#browsers/IMidaBrowserTab";
import { ChromiumBrowser } from "#browsers/chromium/ChromiumBrowser";

export class BdSwissBroker extends MidaBroker {
    // Represents the broker name.
    public static readonly NAME: string = "BDSwiss";

    // Represents the broker browser used internally to navigate the website.
    private _browser: IMidaBrowser;

    // Represents the broker browser tabs used to perform actions on the website.
    private _browserTabs: {
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

        if (!isLoggedIn) {
            throw new Error();
        }

        await loginTab.close();
    }
}
