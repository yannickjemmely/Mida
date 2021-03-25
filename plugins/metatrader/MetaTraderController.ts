import { MidaBrowserTab } from "#utilities/browser/MidaBrowserTab";
import { MidaEvent } from "#events/MidaEvent";
import { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MetaTraderBrokerLoginParameters } from "!plugins/metatrader/MetaTraderBrokerLoginParameters";
import { MidaEmitter } from "#utilities/emitter/MidaEmitter";

export class MetaTraderController {
    private readonly _browserTab: MidaBrowserTab;
    private _isLoggedIn: boolean;
    private readonly _emitter: MidaEmitter;

    public constructor (browserTab: MidaBrowserTab) {
        this._browserTab = browserTab;
        this._isLoggedIn = false;
        this._emitter = new MidaEmitter();
    }

    public async login ({ id, password, serverName, version = 4, }: MetaTraderBrokerLoginParameters): Promise<void> {
        if (this._isLoggedIn) {
            throw new Error();
        }

        await this._appendDomListeners();

        const loginButtonSelector: string = ".menu .box span div:nth-child(8)";
        const idBoxSelector: string = "#login";
        const passwordBoxSelector: string = "#password";
        const serverBoxSelector: string = "#server";
        const confirmButtonSelector: string = ".modal:not(.hidden) .w .b > button + button";

        try {
            // await this._browserTab.waitForSelector(loginButtonSelector);
            // await this._browserTab.click(loginButtonSelector, 3);
            await this._browserTab.waitForSelector(`${idBoxSelector}, ${passwordBoxSelector}, ${serverBoxSelector}, ${confirmButtonSelector}`);
            await this._browserTab.type(idBoxSelector, id);
            await this._browserTab.type(passwordBoxSelector, password);
            await this._browserTab.click(serverBoxSelector, 3);
            await this._browserTab.type(serverBoxSelector, serverName);
            await this._browserTab.click(confirmButtonSelector);
        }
        catch (error) {
            throw new Error();
        }

/*
        try {
            await this._appendIdentifiers();
        }
        catch (error) {
            throw new Error();
        }*/

        this._isLoggedIn = true;
    }

    public async logout (): Promise<void> {

    }

    public async getJournalMessages (): Promise<string[]> {
        return this._browserTab.evaluate(`((w) => {
            return [ ...w.document.querySelectorAll(".journal tr[draggable]:not(.dev) td:last-child .content") ].map((n) => n.innerText);
        })(window);`);
    }

    public async getOrders (): Promise<any[]> {
        let orders: any[];

        try {
            orders = await this._browserTab.evaluate("[ ...window.B.Oa.Xa.A.ff, ...window.B.Oa.Xa.A.history, ]");
        }
        catch (error) {
            throw new Error();
        }

        if (!Array.isArray(orders)) {
            throw new Error();
        }

        return orders;
    }

    public async placeOrder (): Promise<any> {

    }

    private async _appendDomListeners (): Promise<void> {
        // <journal>
        await this._browserTab.exposeCallable("__onJournalMessage", () => this._onJournalMessage());
        await this._browserTab.waitForSelector(".journal");
        await this._browserTab.evaluate(`((w) => {
            const observer = new MutationObserver(w.__onJournalMessage);
            
            observer.observe(w.document.querySelector(".journal"), {
                childList: true,
                subtree: true,
            });
        })(window);`);
        // </journal>
    }

    private async _appendDomIdentifiers (): Promise<void> {
        // <symbols>
        const symbolsElementAttributeName: string = "external-symbols-wrapper";

        await this._browserTab.evaluate(`((w) => {
            w.document.querySelector(".page-block.bar > .page-block:first-child a[title=Symbols]").click();
            w.document.querySelector(".modal:not(.hidden)").setAttribute("${symbolsElementAttributeName}", "");
            w.document.querySelector("[${symbolsElementAttributeName}] > div > div:nth-child(2)").click();
        })(window);`);
        // </symbols>

        // <orders>
        const orderElementAttributeName: string = "external-order-wrapper";

        await this._browserTab.evaluate(`((w) => {
            w.document.querySelector('.page-block.bar > .page-block:first-child a[title="New Order"]').click();
            w.document.querySelector(".modal:not(.hidden)").setAttribute("${orderElementAttributeName}", "");
        })(window);`);
        // </orders>
    }

    private async _addMarketWatchSymbol (symbol: string): Promise<void> {

    }

    private async _removeMarketWatchSymbol (symbol: string): Promise<void> {

    }

    private async _requestSymbolTimeframe (timeframe: number): Promise<void> {
        let timeframeType: string = "";

        switch (timeframe) {
            case 60:
                timeframeType = "M1";

                break;
        }
    }

    private async _onTick (): Promise<void> {

    }

    private async _onJournalMessage (): Promise<void> {
        const messages: string[] = await this.getJournalMessages();

        console.log(messages[0]);
    }
}
