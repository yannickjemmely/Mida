import * as Puppeteer from "puppeteer";
import { IMidaBrowser } from "#browsers/IMidaBrowser";
import { IMidaBrowserTab } from "#browsers/IMidaBrowserTab";
import { ChromiumBrowser } from "#browsers/chromium/ChromiumBrowser";
import { MidaHTTPResponse } from "#utilities/MidaHTTPResponse";

export class ChromiumBrowserTab implements IMidaBrowserTab {
    private readonly _chromiumBrowser: ChromiumBrowser;
    private readonly _puppeteerPage: Puppeteer.Page;

    private readonly _requestListeners: Function[];
    private _isRequestInterceptionEnabled: boolean;

    public constructor (chromiumBrowser: ChromiumBrowser, puppeteerPage: Puppeteer.Page) {
        this._chromiumBrowser = chromiumBrowser;
        this._puppeteerPage = puppeteerPage;
        this._requestListeners = [];
        this._isRequestInterceptionEnabled = false;
    }

    public get browser (): IMidaBrowser {
        return this._chromiumBrowser;
    }

    public async setUserAgent (userAgent: string): Promise<void> {
        return this._puppeteerPage.setUserAgent(userAgent);
    }

    public async goto (uri: string): Promise<MidaHTTPResponse> {
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

    public async addRequestListener (listener: Function): Promise<void> {
        if (!this._isRequestInterceptionEnabled) {
            await this._puppeteerPage.setRequestInterception(true);

            this._puppeteerPage.on("request", (request: any) => {
                for (const listener of this._requestListeners) {
                    listener({
                        uri: request.url(),
                    });
                }

                request.continue();
            });

            this._isRequestInterceptionEnabled = true;
        }

        this._requestListeners.push(listener);
    }

    public async close (): Promise<void> {
        if (this._puppeteerPage) {
            await this._puppeteerPage.close();
        }
    }
}
