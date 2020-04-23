import { IMidaBrowser } from "#browsers/IMidaBrowser";
import { IMidaBrowserTab } from "#browsers/IMidaBrowserTab";
import { ChromiumBrowser } from "#browsers/chromium/ChromiumBrowser";
import { MidaSignal } from "#signals/MidaSignal";
import { MidaSignalListener } from "#signals/MidaSignalListener";
import { MidaTelegramSpy } from "#signals/MidaTelegramSpy";

export class MidaTower {
    private static readonly _listeners: MidaSignalListener[] = [];
    private static readonly _telegramSpies: MidaTelegramSpy[] = [];
    private static readonly _telegramSpiesTabs: {
        [channelID: string]: {
            // Represents a reference to the browser of the spy.
            browser: IMidaBrowser;

            // Represents a reference to the browser tab of the spy.
            browserTab: IMidaBrowserTab;
        };
    } = {};
    private static _enabled: boolean = false;

    private constructor () {
        // Silence is golden.
    }

    public static addSignalListener (signalListener: MidaSignalListener): void {
        this._listeners.push(signalListener);
    }

    public static notify (signal: MidaSignal): void {
        for (const listener of this._listeners) {
            if (listener.forexPairs && listener.forexPairs.length > 0 && !listener.forexPairs.includes(signal.directives.forexPair)) {
                continue;
            }

            listener.notify(signal);
        }
    }

    public static addTelegramSpy (telegramSpy: MidaTelegramSpy): void {
        this._telegramSpies.push(telegramSpy);
    }

    public static get enabled (): boolean {
        return this._enabled;
    }

    public static set enabled (value: boolean) {
        const previousValue: boolean = this._enabled;

        this._enabled = value;

        if (value && !previousValue) {
            this._update();
        }
    }

    private static async _update (): Promise<void> {
        if (!this._enabled) {
            return;
        }

        for (const telegramSpy of this._telegramSpies) {
            let browser: IMidaBrowser;
            let browserTab: IMidaBrowserTab;

            if (!this._telegramSpiesTabs[telegramSpy.channelID]) {
                browser = new ChromiumBrowser();

                await browser.open(`${this.name}-${telegramSpy.name}`);

                browserTab = await browser.openTab();

                await browserTab.goto(`https://web.telegram.org/#/im?p=${telegramSpy.channelID}`);

                this._telegramSpiesTabs[telegramSpy.channelID] = {
                    browser,
                    browserTab,
                };
            }
            else {
                browser = this._telegramSpiesTabs[telegramSpy.channelID].browser;
                browserTab = this._telegramSpiesTabs[telegramSpy.channelID].browserTab;
            }

            const lastMessageSelector: string = ".im_history_scrollable .im_history_messages_peer:not(.ng-hide) .im_history_message_wrap:last-child .im_message_text";

            await browserTab.waitForSelector(lastMessageSelector);

            const lastMessage: any = await browserTab.evaluate(`(() => {
                const lastMessage = window.document.querySelector("${lastMessageSelector}").innerText;
                
                if (!window.__lastMessage__) {
                    window.__lastMessage__ = lastMessage;
                }
                
                if (window.__lastMessage__ === lastMessage) {
                    return null;
                }
                
                window.__lastMessage__ = lastMessage;
                
                return lastMessage;
            })();`);

            if (lastMessage) {
                const signal: MidaSignal | null = telegramSpy.parse(lastMessage);

                if (signal) {
                    this.notify(signal);
                }
            }
        }

        setTimeout(() => this._update(), 500);
    }
}
