import { MidaBrowserTab } from "#utilities/browser/MidaBrowserTab";
import { MidaEvent } from "#events/MidaEvent";
import { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";
import { MetaTraderBrokerLoginParameters } from "!plugins/metatrader/MetaTraderBrokerLoginParameters";
import { MidaEmitter } from "#utilities/emitter/MidaEmitter";
import { MidaBrokerOrderDirectives } from "#orders/MidaBrokerOrderDirectives";

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

        await new Promise((resolve: any): any => setTimeout(resolve, 10000));

/*
        try {
            await this._appendIdentifiers();
        }
        catch (error) {
            throw new Error();
        }*/

        await this._appendListeners();
        await this._appendDomIdentifiers();

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

    public async placeOrder (directives: MidaBrokerOrderDirectives): Promise<any> {
        const orderDescriptor: any = await this._browserTab.evaluate(`((w) => {
            const orderInterface = w.document.querySelector("[external-order-wrapper]").cloneNode(true);
            
            w.document.body.appendChild(orderInterface);
            
            orderInterface.querySelector("#symbol").value = "${directives.symbol}";
            
            //orderInterface.remove();
        })(window);`);
    }

    private async _appendListeners (): Promise<void> {
        // <journal>
        await this._browserTab.exposeCallable("__onJournalMessage", (descriptor: any) => this._onJournalMessage(descriptor));
        await this._browserTab.waitForSelector(".journal");
        await this._browserTab.evaluate(`((w) => {
            const observer = new MutationObserver(w.__onJournalMessage);
            
            observer.observe(w.document.querySelector(".journal"), {
                childList: true,
                subtree: true,
            });
        })(window);`);
        // </journal>

        // <ticks>
        await this._browserTab.exposeCallable("__onTick", (descriptor: any) => this._onTick(descriptor));
        await this._browserTab.waitForSelector(".symbols-table");
        await this._browserTab.evaluate(`((w) => {
            window.B.Oa.Xa.Vb.Ea = new Proxy(window.B.Oa.Xa.Vb.Ea, {
                set (item, property, value) {
                    w.__onTick({
                        symbol: value.J,
                        bid: value.gb,
                        ask: value.wb,
                        date: new Date(value.vg),
                    });
                },
            });
        })(window);`);
        // </ticks>
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

            default:
                throw new Error();
        }


    }

    private _onTick ({ symbol, bid, ask, date, }: any): void {
        if (typeof symbol !== "string" || typeof bid !== "number" || typeof ask !== "number" || typeof date !== "object") {
            throw new Error();
        }

        this._emitter.notifyListeners("tick", { symbol, bid, ask, date, });
    }

    private _onJournalMessage ({ message, date, }: any): void {
        if (typeof message !== "string" || typeof date !== "object") {
            throw new Error();
        }

        this._emitter.notifyListeners("journal-message", { message, date, });
    }
}
