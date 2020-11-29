import * as Puppeteer from "puppeteer";
import { MidaBrowser } from "#browsers/MidaBrowser";
import { MidaBrowserTab } from "#browsers/MidaBrowserTab";
import { ChromiumBrowser } from "#browsers/chromium/ChromiumBrowser";
import { MidaHttpResponse } from "#utilities/http/MidaHttpResponse";

export class ChromiumBrowserTab extends MidaBrowserTab {
    private readonly _chromiumBrowser: ChromiumBrowser;
    private readonly _puppeteerPage: Puppeteer.Page;

    public constructor (chromiumBrowser: ChromiumBrowser, puppeteerPage: Puppeteer.Page) {
        super();

        this._chromiumBrowser = chromiumBrowser;
        this._puppeteerPage = puppeteerPage;
    }

    public get browser (): MidaBrowser {
        return this._chromiumBrowser;
    }

    public async setUserAgent (userAgent: string): Promise<void> {
        return this._puppeteerPage.setUserAgent(userAgent);
    }

    public async goto (uri: string): Promise<MidaHttpResponse> {
        const response: Puppeteer.Response | null = await this._puppeteerPage.goto(uri, {
            timeout: 60000 * 2,
        });

        if (!response) {
            throw new Error();
        }

        return {
            status: response.status(),
            headers: response.headers(),
            body: await response.text(),
        };
    }

    public async evaluate (text: string): Promise<any> {
        return this._puppeteerPage.evaluate(text);
    }

    public async exposeProcedure (name: string, procedure: (...parameters: any[]) => any): Promise<void> {
        return this._puppeteerPage.exposeFunction(name, procedure);
    }

    public async focus (selector: string): Promise<boolean> {
        try {
            await this._puppeteerPage.focus(selector);
        }
        catch (error) {
            console.log(error);

            return false;
        }

        return true;
    }

    public async type (selector: string, text: string): Promise<boolean> {
        try {
            await this._puppeteerPage.type(selector, text);
        }
        catch (error) {
            console.log(error);

            return false;
        }

        return true;
    }

    public async click (selector: string, count: number = 1): Promise<boolean> {
        try {
            await this._puppeteerPage.click(selector, {
                clickCount: count,
            });
        }
        catch (error) {
            console.log(error);

            return false;
        }

        return true;
    }

    public async waitForSelector (selector: string): Promise<void> {
        try {
            await this._puppeteerPage.waitForSelector(selector);
        }
        catch (error) {
            console.log(error);
        }
    }

    public async close (): Promise<void> {
        if (this._puppeteerPage) {
            await this._puppeteerPage.close();
        }
    }
}
