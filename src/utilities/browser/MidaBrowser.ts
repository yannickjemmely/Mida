import * as Puppeteer from "puppeteer";
import { MidaBrowserTab } from "#utilities/browser/MidaBrowserTab";

/** Represents a browser. */
export class MidaBrowser {
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
        return this._pid !== -1;
    }

    public async open (): Promise<void> {
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

            this._puppeteerBrowser = await Puppeteer.launch({
                headless: false,
                devtools: false,
                ignoreHTTPSErrors: true,
                args: browserArguments,
            });
            const process: any = this._puppeteerBrowser.process();

            if (!process) {
                throw new Error();
            }

            this._pid = process.pid;

            await this.closeTabs();
        }
    }

    public async openTab (): Promise<MidaBrowserTab> {
        if (!this._puppeteerBrowser) {
            throw new Error();
        }

        return new MidaBrowserTab(this, await this._puppeteerBrowser.newPage());
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
}
