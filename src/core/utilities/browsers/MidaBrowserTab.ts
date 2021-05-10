import * as Puppeteer from "puppeteer";

import { MidaBrowser } from "#utilities/browsers/MidaBrowser";

/** Represents a browser tab. */
export class MidaBrowserTab {
    private readonly _browser: MidaBrowser;
    private readonly _puppeteerPage: Puppeteer.Page;

    public constructor (browser: MidaBrowser, puppeteerPage: Puppeteer.Page) {
        this._browser = browser;
        this._puppeteerPage = puppeteerPage;
    }

    public get browser (): MidaBrowser {
        return this._browser;
    }

    public async setUserAgent (userAgent: string): Promise<void> {
        return this._puppeteerPage.setUserAgent(userAgent);
    }

    public async goto (uri: string): Promise<any> {
        const response: Puppeteer.HTTPResponse = await this._puppeteerPage.goto(uri, {
            timeout: 60000,
        });

        return {
            status: response.status(),
            headers: response.headers(),
            body: await response.text(),
        };
    }

    public async exposeCallable (name: string, callable: (...parameters: any) => any): Promise<void> {
        return this._puppeteerPage.exposeFunction(name, callable);
    }

    public async evaluate (text: string): Promise<any> {
        return this._puppeteerPage.evaluate(text);
    }

    public async evaluateOnNewDocument (text: string): Promise<any> {
        return this._puppeteerPage.evaluateOnNewDocument(text);
    }

    public async focus (selector: string): Promise<void> {
        try {
            await this._puppeteerPage.focus(selector);
        }
        catch (error) {
            console.log(error);
        }
    }

    public async type (selector: string, text: string): Promise<void> {
        try {
            await this._puppeteerPage.type(selector, text);
        }
        catch (error) {
            console.log(error);
        }
    }

    public async click (selector: string, count: number = 1): Promise<void> {
        try {
            await this._puppeteerPage.click(selector, {
                clickCount: count,
            });
        }
        catch (error) {
            console.log(error);
        }
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
