import * as Path from "path";
import * as Puppeteer from "puppeteer";
import { IMidaBrowser } from "#browsers/IMidaBrowser";
import { ChromiumBrowserTab } from "#browsers/chromium/ChromiumBrowserTab";

export class ChromiumBrowser implements IMidaBrowser {
    private static readonly _shared: ChromiumBrowser = new ChromiumBrowser();

    private _puppeteerBrowser: Puppeteer.Browser | undefined;
    private _pid: number;

    public constructor () {
        this._puppeteerBrowser = undefined;
        this._pid = -1;
    }

    public get pid (): number {
        return this._pid;
    }

    public get isOpen (): boolean {
        return this.pid !== -1;
    }

    public async open (id?: string): Promise<void> {
        if (!this._puppeteerBrowser) {
            const browserArguments: string[] = [
                "--no-sandbox",
                "--disable-gl-drawing-for-tests",
                "--mute-audio",
                "--window-size=1280,1024",
                "--disable-accelerated-2d-canvas",
                "--disable-background-timer-throttling",
                "--disable-gpu",
                "--disable-infobars",
                "--disable-features=site-per-process",
            ];

            if (id) {
                browserArguments.push(`--user-data-dir=${Path.resolve(__dirname, id)}`);
            }

            this._puppeteerBrowser = await Puppeteer.launch({
                headless: true,
                devtools: false,
                ignoreHTTPSErrors: true,
                args: browserArguments,
            });
            this._pid = this._puppeteerBrowser.process().pid;

            await this.closeTabs();
        }
    }

    public async openTab (): Promise<ChromiumBrowserTab> {
        if (!this._puppeteerBrowser) {
            throw new Error();
        }

        return new ChromiumBrowserTab(this, await this._puppeteerBrowser.newPage());
    }

    public async closeTabs (): Promise<void> {
        if (!this._puppeteerBrowser) {
            throw new Error();
        }

        await Promise.all((await this._puppeteerBrowser.pages()).map((tab: Puppeteer.Page): Promise<any> => tab.close()));
    }

    public async close (): Promise<void> {
        if (this._puppeteerBrowser) {
            await this._puppeteerBrowser.close();

            this._pid = -1;
        }
    }

    public static async openTab (): Promise<ChromiumBrowserTab> {
        if (!ChromiumBrowser._shared.isOpen) {
            await ChromiumBrowser._shared.open();
        }

        return ChromiumBrowser._shared.openTab();
    }
}
