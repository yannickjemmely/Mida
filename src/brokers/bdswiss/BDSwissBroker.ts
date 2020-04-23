import { IMidaBroker } from "#brokers/IMidaBroker";
import { IMidaBrowser } from "#browsers/IMidaBrowser";
import { IMidaBrowserTab } from "#browsers/IMidaBrowserTab";
import { ChromiumBrowser } from "#browsers/chromium/ChromiumBrowser";
import { MidaPosition } from "#position/MidaPosition";
import { MidaPositionDirectionType } from "#position/MidaPositionDirectionType";
import { MidaPositionDirectives } from "#position/MidaPositionDirectives";

export class BDSwissBroker implements IMidaBroker {
    private _browser: IMidaBrowser;
    private _loggedIn: boolean;
    private _accountMeta: any;
    private _tabs: {
        [name: string]: IMidaBrowserTab;
    };

    public constructor () {
        this._browser = new ChromiumBrowser();
        this._loggedIn = false;
        this._tabs = {};

        setInterval(() => this._update(), 50);
    }

    public get loggedIn (): boolean {
        return this._loggedIn;
    }

    public async login (accountMeta: any): Promise<boolean> {
        if (this._loggedIn) {
            return true;
        }

        try {
            await this._browser.open();

            const loginTab: IMidaBrowserTab = await this._browser.openTab();
            const loginURI: string = "https://dashboard.bdswiss.com/login";
            const emailInputSelector: string = "#email";
            const passwordInputSelector: string = "#password";

            await loginTab.goto(loginURI);
            await loginTab.waitForSelector(`${emailInputSelector},${passwordInputSelector}`);
            await loginTab.type(emailInputSelector, accountMeta.email);
            await loginTab.type(passwordInputSelector, accountMeta.password);

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

            this._loggedIn = true;
            this._accountMeta = accountMeta;
        }
        catch (error) {
            console.error(error);

            return false;
        }

        await this._loadTradeTab();
        await this._loadPositionsTab();

        return true;
    }

    public async openPosition (positionDirectives: MidaPositionDirectives): Promise<boolean> {
        const tradeTab: IMidaBrowserTab = this._tabs.tradeTab;
        const forexPairText: string = `${positionDirectives.forexPair.baseCurrency.id}/${positionDirectives.forexPair.quoteCurrency.id}`;
        const amount: number = positionDirectives.lots * 100000;
        const searchTextBoxSelector: string = "#assetsSearchInput";
        const firstSearchResultSelector: string = ".select-assets__table .rt-table .rt-tbody > [role=rowgroup]:first-child";

        await tradeTab.type(searchTextBoxSelector, forexPairText);
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

        return false;
    }

    public async getOpenPositions (): Promise<MidaPosition[]> {
        return this._tabs.positionsTab.evaluate(`(() => {
            const positions = [];
            const rows = window.document.querySelectorAll("#positionsPaneContent .rt-tbody [role=rowgroup] [role=row]");
            
            for (const row of rows) {
                const columns = row.childNodes;
                const assetName = row.childNodes[1].innerText;
                
                if (!assetName || assetName.length < 3) {
                    continue;
                }
                
                positions.push({
                    assetName,
                    direction: columns[3].innerText,
                    profit: columns[5].innerText,
                    openPrice: columns[6].innerText,
                });
            }
            
            return positions;
        })();`);
    }

    public async logout (): Promise<boolean> {
        return false;
    }

    private async _update (): Promise<void> {
        if (!this._loggedIn) {
            return;
        }
    }

    private async _loadTradeTab (): Promise<boolean> {
        try {
            const tradeTab: IMidaBrowserTab = await this._browser.openTab();

            await tradeTab.goto(`https://trade.bdswiss.com/?embedded=true&login=${this._accountMeta.accountID}`);

            this._tabs.tradeTab = tradeTab;
        }
        catch (error) {
            console.error(error);

            return false;
        }

        return true;
    }

    private async _loadPositionsTab (): Promise<boolean> {
        try {
            const positionsTab: IMidaBrowserTab = await this._browser.openTab();
            const positionsButtonSelector: string = ".actions .actions__item:nth-child(2) > button";

            await positionsTab.goto(`https://trade.bdswiss.com/?embedded=true&login=${this._accountMeta.accountID}`);
            await positionsTab.waitForSelector(positionsButtonSelector);
            await positionsTab.click(positionsButtonSelector);

            this._tabs.positionsTab = positionsTab;
        }
        catch (error) {
            console.error(error);

            return false;
        }

        return true;
    }
}
