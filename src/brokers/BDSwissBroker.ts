import { IMidaBroker } from "#brokers/IMidaBroker";
import { IMidaBrowser } from "#browsers/IMidaBrowser";
import { IMidaBrowserTab } from "#browsers/IMidaBrowserTab";
import { ChromiumBrowser } from "#browsers/ChromiumBrowser";
import { MidaCurrency } from "#currency/MidaCurrency";
import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaForexPairExchangeRate } from "#forex/MidaForexPairExchangeRate";
import { MidaMarket } from "#market/MidaMarket";
import { MidaPosition, createPositionUUID } from "#position/MidaPosition";
import { MidaPositionDirectionType } from "#position/MidaPositionDirectionType";
import { MidaPositionDirectives } from "#position/MidaPositionDirectives";
import { MidaPositionStatusType } from "#position/MidaPositionStatusType";

export class BDSwissBroker implements IMidaBroker {
    // Represents the name of the broker.
    public static readonly NAME: string = "BDSwiss";

    // Represents a reference to the browser used internally to navigate the website of the broker.
    private _browser: IMidaBrowser | null;

    // Represents a list of browser tabs used to perform actions on the website of the broker.
    private _browserTabs: {
        [name: string]: IMidaBrowserTab;
    };

    // Represents the meta of the logged in account.
    private _accountMeta: any;

    // Indicates if an account is logged in.
    private _isLoggedIn: boolean;

    // Represents a set of positions created through this broker.
    private _localPositions: {
        [positionUUID: string]: {
            // Represents the order ID of the position.
            orderID: string;

            // Represents the directives of the position.
            directives: MidaPositionDirectives;

            // Represents the position open date.
            openDate: Date;

            // Represents the position close date.
            closeDate?: Date;
        };
    };

    public constructor () {
        this._browser = null;
        this._browserTabs = {};
        this._accountMeta = null;
        this._isLoggedIn = false;
        this._localPositions = {};
    }

    public get isLoggedIn (): boolean {
        return this._isLoggedIn;
    }

    public get name (): string {
        return BDSwissBroker.NAME;
    }

    public async login (meta: any): Promise<boolean> {
        if (this._isLoggedIn) {
            return true;
        }

        try {
            this._browser = new ChromiumBrowser();

            await this._browser.open();

            const loginTab: IMidaBrowserTab = await this._browser.openTab();
            const loginURI: string = "https://dashboard.bdswiss.com/login";
            const emailInputSelector: string = "#email";
            const passwordInputSelector: string = "#password";

            await loginTab.goto(loginURI);
            await loginTab.waitForSelector(`${emailInputSelector},${passwordInputSelector}`);
            await loginTab.type(emailInputSelector, meta.email);
            await loginTab.type(passwordInputSelector, meta.password);

            await loginTab.evaluate(`(async () => {
                await new Promise((resolve) => setTimeout(resolve, 5000));
            
                jQuery(document.getElementsByTagName("button")[3]).click();
            })();`);

            await new Promise((resolve: any): any => setTimeout(resolve, 10000));

            const isLoggedIn: boolean = await loginTab.evaluate(`(() => {
                return window.location.href === "https://dashboard.bdswiss.com/accounts";
            })();`);

            if (!isLoggedIn) {
                return false;
            }

            this._accountMeta = meta;
            this._isLoggedIn = true;
        }
        catch (error) {
            console.error(error);

            return false;
        }

        await this._loadTradeTab();
        await this._loadForexTab();
        await this._loadPositionsTab();

        return true;
    }

    public async openPosition (positionDirectives: MidaPositionDirectives): Promise<MidaPosition> {
        const tradeTab: IMidaBrowserTab = this._browserTabs.tradeTab;
        const amount: number = positionDirectives.lots * 100000;
        const searchTextBoxSelector: string = "#assetsSearchInput";
        const firstSearchResultSelector: string = ".select-assets__table .rt-table .rt-tbody > [role=rowgroup]:first-child";

        await tradeTab.type(searchTextBoxSelector, positionDirectives.forexPair.ID);
        await tradeTab.click(firstSearchResultSelector);

        if (positionDirectives.direction === MidaPositionDirectionType.BUY) {
            const buyButtonSelector: string = ".select-assets__table .rt-table .rt-tbody > [role=rowgroup]:first-child button[data-cy=assetBuy]";

            await tradeTab.click(buyButtonSelector);
        }
        else {
            const sellButtonSelector: string = ".select-assets__table .rt-table .rt-tbody > [role=rowgroup]:first-child button[data-cy=assetSell]";

            await tradeTab.click(sellButtonSelector);
        }

        const amountTextBoxSelector: string = "[data-cy=Amount]";

        await tradeTab.click(amountTextBoxSelector, 3);
        await tradeTab.type(amountTextBoxSelector, amount.toString());

        if (positionDirectives.takeProfit) {
            const takeProfitCheckBoxSelector: string = "[data-cy=checkboxTakeProfit]";
            const takeProfitTextBoxSelector: string = "[data-cy=TakeProfit]";

            await tradeTab.click(takeProfitCheckBoxSelector);
            await tradeTab.click(takeProfitTextBoxSelector, 3);
            await tradeTab.type(takeProfitTextBoxSelector, positionDirectives.takeProfit.toString());
        }

        if (positionDirectives.stopLoss) {
            const stopLossCheckBoxSelector: string = "[data-cy=checkboxStopLoss]";
            const stopLossTextBoxSelector: string = "[data-cy=StopLoss]";

            await tradeTab.click(stopLossCheckBoxSelector);
            await tradeTab.click(stopLossTextBoxSelector, 3);
            await tradeTab.type(stopLossTextBoxSelector, positionDirectives.stopLoss.toString());
        }

        const placeTradeButtonSelector: string = "button[data-cy=placeTrade]";

        await tradeTab.click(placeTradeButtonSelector);
        await tradeTab.click(searchTextBoxSelector, 3);
        await tradeTab.type(searchTextBoxSelector, "");
        await new Promise((resolve: any): void => {
            setTimeout(resolve, 5000);
        });

        const orderID: string = await this._browserTabs.positionsTab.evaluate(`(() => {
            return window.document.querySelector("#positionsPaneContent .rt-tbody [role=rowgroup] [role=row]").childNodes[2].innerText.trim();
        })();`);
        const positionUUID: string = createPositionUUID();

        this._localPositions[positionUUID] = {
            orderID,
            directives: positionDirectives,
            openDate: new Date(),
        };

        const position: MidaPosition | null = await this.getPositionByUUID(positionUUID);

        if (!position) {
            throw new Error();
        }

        return position;
    }

    public async getPositionByUUID (UUID: string): Promise<MidaPosition | null> {
        const localPosition: any = this._localPositions[UUID];
        const livePosition: any = await this._getPositionByOrderID(localPosition.orderID);

        if (!localPosition || !livePosition) {
            return null;
        }

        const position: MidaPosition = {
            UUID,
            directives: localPosition.directives,
            status: MidaPositionStatusType.OPEN,
            date: new Date(),
            openDate: localPosition.openDate,
            openPrice: parseFloat(livePosition.openPrice),
            closeDate: undefined,
            profit: parseFloat(livePosition.profit),
            brokerName: BDSwissBroker.NAME,
            update: async (): Promise<MidaPosition> => {
                const position: MidaPosition | null = await this.getPositionByUUID(UUID);

                if (!position) {
                    throw new Error();
                }

                return position;
            },
            close: async (): Promise<boolean> => this.closePositionByUUID(UUID),
        };

        if (localPosition.closeDate) {
            position.status = MidaPositionStatusType.CLOSE;
            position.closeDate = localPosition.closeDate;
        }
        else {
            delete position.closeDate;
        }

        return position;
    }

    public async closePositionByUUID (UUID: string): Promise<boolean> {
        const localPosition: any = this._localPositions[UUID];

        if (!localPosition) {
            return false;
        }

        return this._closePositionByOrderID(localPosition.orderID);
    }

    public async getPositionsByStatus (status: MidaPositionStatusType): Promise<MidaPosition[]> {
        const positions: MidaPosition[] = [];

        for (const positionUUID in this._localPositions) {
            const position: MidaPosition | null = await this.getPositionByUUID(positionUUID);

            if (position && position.status === status) {
                positions.push(position);
            }
        }

        return positions;
    }

    public async getEquity (): Promise<number> {
        const forexTab: IMidaBrowserTab = this._browserTabs.forexTab;
        const plainEquity: any = await forexTab.evaluate(`(() => {
            return window.document.querySelector("[data-cy=equity]").innerText.trim().split(" ")[1].replace(/,/g, "");
        })();`);

        return parseFloat(plainEquity);
    }

    public async getEquityCurrency (): Promise<MidaCurrency> {
        const forexTab: IMidaBrowserTab = this._browserTabs.forexTab;
        const currencySymbol: any = await forexTab.evaluate(`(() => {
            return window.document.querySelector("[data-cy=equity]").innerText.trim().split(" ")[0];
        })();`);

        return MidaMarket.getCurrencyBySymbol(currencySymbol);
    }

    public async getForexPairExchangeRate (forexPair: MidaForexPair): Promise<MidaForexPairExchangeRate> {
        const forexTab: IMidaBrowserTab = this._browserTabs.forexTab;
        const forexPairPrice: any = await forexTab.evaluate(`(() => {
            const forexPairRow = window.document.querySelector("[data-cy='${forexPair.ID}']").parentNode.parentNode;
            
            return forexPairRow.querySelector(".rt-td:nth-child(5)").innerText.trim().replace(/,/g, "");
        })();`);

        return {
            forexPair,
            date: new Date(),
            price: parseFloat(forexPairPrice),
        };
    }

    public async logout (): Promise<boolean> {
        if (!this.isLoggedIn) {
            return false;
        }

        await this._browser?.close();

        this._browser = null;
        this._browserTabs = {};
        this._accountMeta = null;
        this._isLoggedIn = false;
        this._localPositions = {};

        return true;
    }

    private async _getPositionByOrderID (orderID: string): Promise<any> {
        const openPositionDescriptor: any = await this._browserTabs.positionsTab.evaluate(`(() => {
            const rowSelector = ".rt-td > [title='${orderID}']";
            const column = window.document.querySelector(rowSelector);
            
            if (!column) {
                return null;
            }
            
            const row = column.parentNode.parentNode;
            
            return {
                profit: row.childNodes[5].innerText.trim().split(" ")[1].replace(/,/g, ""),
                openPrice: row.childNodes[7].innerText.trim().replace(/,/g, ""),
            };
        })();`);

        if (!openPositionDescriptor) {
            return null;
        }

        return openPositionDescriptor;
    }

    private async _closePositionByOrderID (orderID: string): Promise<boolean> {
        try {
            const positionsTab: IMidaBrowserTab = this._browserTabs.positionsTab;
            const isCloseModalOpen: boolean = await positionsTab.evaluate(`(() => {
                try {
                    const rowSelector = ".rt-td > [title='${orderID}']";
                    
                    window.document.querySelector(rowSelector).parentNode.parentNode.childNodes[10].childNodes[0].click();
                    
                    return true;
                }
                catch (error) {
                    return false;
                }
            })();`);

            if (!isCloseModalOpen) {
                return false;
            }

            const closeButtonSelector: string = ".modal-footer [data-cy=confirm]";

            await positionsTab.waitForSelector(closeButtonSelector);
            await positionsTab.click(closeButtonSelector);

            return true;
        }
        catch (error) {
            console.error("Failed to close position.");

            return false;
        }
    }

    private async _loadTradeTab (): Promise<boolean> {
        if (!this._browser) {
            throw new Error();
        }

        try {
            const tradeTab: IMidaBrowserTab = await this._browser.openTab();

            await tradeTab.goto(`https://trade.bdswiss.com/?embedded=true&login=${this._accountMeta.accountID}`);

            this._browserTabs.tradeTab = tradeTab;
        }
        catch (error) {
            console.error(error);

            return false;
        }

        return true;
    }

    private async _loadForexTab (): Promise<boolean> {
        if (!this._browser) {
            throw new Error();
        }

        try {
            const forexTab: IMidaBrowserTab = await this._browser.openTab();
            const forexFilterSelector: string = "[data-cy=forex]";

            await forexTab.goto(`https://trade.bdswiss.com/?embedded=true&login=${this._accountMeta.accountID}`);
            await forexTab.waitForSelector(forexFilterSelector);
            await forexTab.click(forexFilterSelector);

            this._browserTabs.forexTab = forexTab;
        }
        catch (error) {
            console.error(error);

            return false;
        }

        return true;
    }

    private async _loadPositionsTab (): Promise<boolean> {
        if (!this._browser) {
            throw new Error();
        }

        try {
            const positionsTab: IMidaBrowserTab = await this._browser.openTab();
            const positionsButtonSelector: string = ".actions .actions__item:nth-child(2) > button";

            await positionsTab.goto(`https://trade.bdswiss.com/?embedded=true&login=${this._accountMeta.accountID}`);
            await positionsTab.waitForSelector(positionsButtonSelector);
            await positionsTab.click(positionsButtonSelector);

            this._browserTabs.positionsTab = positionsTab;
        }
        catch (error) {
            console.error(error);

            return false;
        }

        return true;
    }
}
