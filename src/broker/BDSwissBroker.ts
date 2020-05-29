import { AMidaBroker } from "#broker/AMidaBroker";
import { MidaBrokerEventType } from "#broker/MidaBrokerEventType";
import { IMidaBrowser } from "#browser/IMidaBrowser";
import { IMidaBrowserTab } from "#browser/IMidaBrowserTab";
import { ChromiumBrowser } from "#browser/ChromiumBrowser";
import { MidaCurrency } from "#currency/MidaCurrency";
import { MidaCurrencyType } from "#currency/MidaCurrencyType";
import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaForexPairExchangeRate } from "#forex/MidaForexPairExchangeRate";
import { MidaForexPairPeriod } from "#forex/MidaForexPairPeriod";
import { MidaForexPairPeriodType } from "#forex/MidaForexPairPeriodType";
import { MidaForexPairType } from "#forex/MidaForexPairType";
import { MidaPosition, createPositionUUID } from "#position/MidaPosition";
import { MidaPositionDirectives } from "#position/MidaPositionDirectives";
import { MidaPositionSet } from "#position/MidaPositionSet";
import { MidaPositionStatusType } from "#position/MidaPositionStatusType";
import { MidaUtilities } from "#utilities/MidaUtilities";

// @ts-ignore
export class BDSwissBroker extends AMidaBroker {
    // Represents the broker name.
    public static readonly NAME: string = "BDSwiss";

    // Represents the browser used internally to navigate the website of the broker.
    private _browser: IMidaBrowser;

    // Represents the browser tabs used to perform actions on the website of the broker.
    private _browserTabs: {
        [name: string]: IMidaBrowserTab;
    };

    // Represents the meta of the logged in account.
    private _account: any;

    // Indicates if an account is logged in.
    private _isLoggedIn: boolean;

    // Represents the positions created through this broker.
    private _positions: MidaPositionSet;

    // Represents the last ticks.
    private readonly _lastTicks: {
        [forexPairID: string]: MidaForexPairExchangeRate;
    };

    public constructor () {
        super();

        this._browser = new ChromiumBrowser();
        this._browserTabs = {};
        this._account = null;
        this._isLoggedIn = false;
        this._positions = new MidaPositionSet();
        this._lastTicks = {};
    }

    public get isLoggedIn (): boolean {
        return this._isLoggedIn;
    }

    public get name (): string {
        return BDSwissBroker.NAME;
    }

    public async login (account: any): Promise<void> {
        if (this._isLoggedIn) {
            throw new Error();
        }

        await this._browser.open();

        const loginTab: IMidaBrowserTab = await this._browser.openTab(); // TODO: Close the login tab in a safe way.
        const loginURI: string = "https://dashboard.bdswiss.com/login";
        const emailInputSelector: string = "#email";
        const passwordInputSelector: string = "#password";
        const loginButtonSelector: string = "header + div > div:last-child > div:last-child button:last-child";
        const accountSidebarSelector: string = ".sidebar";

        await loginTab.goto(loginURI);
        await loginTab.waitForSelector(`${emailInputSelector},${passwordInputSelector}`);
        await loginTab.type(emailInputSelector, account.email);
        await loginTab.type(passwordInputSelector, account.password);
        await loginTab.click(loginButtonSelector);
        await loginTab.waitForSelector(accountSidebarSelector);

        const isLoggedIn: boolean = await loginTab.evaluate(`((w) => {
            return w.location.href === "https://dashboard.bdswiss.com/accounts";
        })(window);`);

        if (!isLoggedIn) {
            throw new Error();
        }

        this._account = account;
        this._isLoggedIn = true;
        this._browserTabs.tradeTab = await this._openTradeTab();
    }

    public async openPosition (positionDirectives: MidaPositionDirectives): Promise<MidaPosition> {
        const positionUUID: string = createPositionUUID();
        const openDescriptor: any = await this._browserTabs.tradeTab.evaluate(`((w) => {
            const socket = w._MidaBroker.socket;
            const openDirectives = {
                symbol: "${positionDirectives.forexPair.ID2}",
                volume: ${positionDirectives.lots},
                uuid: "${positionUUID}",
                platform: "BDS.WT",
                cmd: "${positionDirectives.direction}",
            };
            
            if (${positionDirectives.takeProfit !== undefined}) {
                openDirectives.tp = ${positionDirectives.takeProfit};
            }
            
            if (${positionDirectives.stopLoss !== undefined}) {
                openDirectives.sl = ${positionDirectives.stopLoss};
            }
            
            return new Promise((resolve, reject) => {
                const listener = (event) => {
                    try {
                        if (event.data.indexOf("ORDER_OPENED") === -1) {
                            return;
                        }
                        
                        const message = JSON.parse(event.data.substr(2));
                        const position = message[1];
                        
                        if (position.uuid === openDirectives.uuid) {
                            clearTimeout(timeout);
                            socket.removeEventListener("message", listener);
                            resolve({
                                orderID: position.order,
                                openPrice: position.openPrice,
                                commission: position.commission,
                                swaps: position.swaps,
                            });
                        }
                    }
                    catch (error) {
                        // Silence is golden.
                    }
                };
                const timeout = setTimeout(() => {
                    socket.removeEventListener("message", listener);
                    resolve(null);
                }, 20000);
                
                socket.addEventListener("message", listener);
                socket.send('42["OPEN_TRADE",' + JSON.stringify(openDirectives) + ']');
            });
        })(window);`);

        if (!openDescriptor) {
            throw new Error();
        }

        const position: MidaPosition = {
            UUID: positionUUID,
            directives: positionDirectives,
            status: MidaPositionStatusType.OPEN,
            openDate: new Date(),
            openPrice: openDescriptor.openPrice,
            closeDate: null,
            closePrice: null,
            broker: {
                name: BDSwissBroker.NAME,
                positionID: openDescriptor.orderID,
            },
            getProfit: async (): Promise<number> => this._getPositionProfitByOrderID(openDescriptor.orderID),
            getCommission: async (): Promise<number> => openDescriptor.commission,
            getSwaps: async (): Promise<number> => openDescriptor.swaps,
            getCurrency: async (): Promise<MidaCurrency> => this.getCurrency(),
            close: async (): Promise<void> => this.closePositionByUUID(positionUUID),
        };

        this._positions.add(position);
        this.notifyEvent(MidaBrokerEventType.POSITION_OPEN, position);

        return position;
    }

    public async getPositionByUUID (positionUUID: string): Promise<MidaPosition | null> {
        return this._positions.get(positionUUID);
    }

    public async closePositionByUUID (positionUUID: string): Promise<void> {
        const position: MidaPosition | null = await this.getPositionByUUID(positionUUID);

        if (!position) {
            throw new Error();
        }

        const closeDescriptor: any = await this._browserTabs.tradeTab.evaluate(`((w) => {
            const socket = w._MidaBroker.socket;
            const closeDirectives = {
                order: ${position?.broker?.positionID},
                volume: ${position.directives.lots},
                uuid: "${positionUUID}",
            };
            
            return new Promise((resolve, reject) => {
                const listener = (event) => {
                    try {
                        if (event.data.indexOf("ORDER_CLOSED") === -1) {
                            return;
                        }
                        
                        const message = JSON.parse(event.data.substr(2));
                        const position = message[1];
                        
                        if (position.order === closeDirectives.order) {
                            clearTimeout(timeout);
                            socket.removeEventListener("message", listener);
                            resolve({
                                orderID: position.order,
                                closePrice: position.closePrice,
                                profit: position.mt4Profit,
                                commission: position.commission,
                                swaps: position.swaps,
                            });
                        }
                    }
                    catch (error) {
                        // Silence is golden.
                    }
                };
                const timeout = setTimeout(() => {
                    socket.removeEventListener("message", listener);
                    resolve(null);
                }, 20000);
                
                socket.addEventListener("message", listener);
                socket.send('42["CLOSE_TRADE",' + JSON.stringify(closeDirectives) + ']');
            });
        })(window);`);

        if (!closeDescriptor) {
            throw new Error();
        }

        position.status = MidaPositionStatusType.CLOSE;
        position.closeDate = new Date();
        position.closePrice = closeDescriptor.closePrice;
        position.getProfit = async (): Promise<number> => closeDescriptor.profit;
        position.getCommission = async (): Promise<number> => closeDescriptor.commission;
        position.getSwaps = async (): Promise<number> => closeDescriptor.swaps;

        this.notifyEvent(MidaBrokerEventType.POSITION_CLOSE, position);
    }

    public async getPositionsByStatus (status: MidaPositionStatusType): Promise<MidaPosition[]> {
        return this._positions.toArray().filter((position: MidaPosition): boolean => position.status === status);
    }

    public async getEquity (): Promise<number> {
        const plainEquity: number = parseFloat(await this._browserTabs.tradeTab.evaluate(`(() => {
            return window.document.querySelector("[data-cy=equity]").innerText.trim().split(" ")[1].replace(/,/g, "");
        })();`));

        if (isNaN(plainEquity)) {
            throw new Error();
        }

        return plainEquity;
    }

    public async getEquityCurrency (): Promise<MidaCurrency> {
        const currencySymbol: string = await this._browserTabs.forexTab.evaluate(`(() => {
            return window.document.querySelector("[data-cy=equity]").innerText.trim().split(" ")[0];
        })();`);

        return MidaCurrencyType.getBySymbol(currencySymbol);
    }

    public async getFreeMargin (): Promise<number> {
        return 0;
    }

    public async getFreeMarginCurrency (): Promise<MidaCurrency> {
        throw new Error();
    }

    public async getForexPairExchangeRate (forexPair: MidaForexPair): Promise<MidaForexPairExchangeRate> {
        return this._lastTicks[forexPair.ID];
    }

    public listenForexPair (forexPair: MidaForexPair): void {
        this._browserTabs.tradeTab.evaluate(`((w) => {
            const socket = w._MidaBroker.socket;
            
            socket.send('42["SUBSCRIBE",{"symbol":"${forexPair.ID2}"}]');
        })(window);`);
    }

    public async getForexPairPeriods (forexPair: MidaForexPair, periodsType: MidaForexPairPeriodType): Promise<MidaForexPairPeriod[]> {
        const periods: MidaForexPairPeriod[] = [];
        const tradeTab: IMidaBrowserTab = await this._openTradeTab();
        const plainPeriods: any[] = await tradeTab.evaluate(`((w) => {
            const socket = w._MidaBroker.socket;
            
            return new Promise((resolve, reject) => {
                const listener = (event) => {
                    try {
                        if (event.data.indexOf("CHART") === -1) {
                            return;
                        }
                        
                        const message = JSON.parse(event.data.substr(2));
                        const periods = message[1];
                        
                        clearTimeout(timeout);
                        socket.removeEventListener("message", listener);
                        resolve(periods.data);
                    }
                    catch (error) {
                        // Silence is golden.
                    }
                };
                const timeout = setTimeout(() => {
                    socket.removeEventListener("message", listener);
                    resolve(null);
                }, 20000);
                
                socket.addEventListener("message", listener);
                socket.send('42["GET_CHART",{"resolution":${periodsType},"symbol":"${forexPair.ID2}"}]');
            });
        })(window);`);

        tradeTab.close();

        if (!plainPeriods) {
            throw new Error();
        }

        plainPeriods.sort((left: any, right: any): number => left.t - right.t);

        for (const plainPeriod of plainPeriods) {
            periods.push({
                forexPair,
                type: periodsType,
                date: new Date((new Date(plainPeriod.t.replace(/-/g, "/"))).valueOf() - 2 * 60 * 60 * 1000),
                open: plainPeriod.o,
                close: plainPeriod.c,
                low: plainPeriod.l,
                high: plainPeriod.h,
                volume: plainPeriod.v,
            });
        }

        return periods;
    }

    public async logout (): Promise<void> {
        if (!this.isLoggedIn) {
            throw new Error();
        }

        await this._browser.close();

        this._browser = new ChromiumBrowser();
        this._browserTabs = {};
        this._account = null;
        this._isLoggedIn = false;
        this._positions = new MidaPositionSet();
    }

    private async _getPositionProfitByOrderID (orderID: string): Promise<number> {
        const profit: number = parseFloat(await this._browserTabs.positionsTab.evaluate(`(() => {
            try {
                const rowSelector = ".rt-td > [title='${orderID}']";
                const column = window.document.querySelector(rowSelector);
                
                if (!column) {
                    return null;
                }
                
                return column.parentNode.parentNode.childNodes[5].innerText.trim().split(" ")[1].replace(/,/g, "");
            }
            catch (error) {
                return null;
            }
        })();`));

        if (isNaN(profit)) {
            throw new Error();
        }

        return profit;
    }

    private async _openTradeTab (): Promise<IMidaBrowserTab> {
        if (!this.isLoggedIn) {
            throw new Error();
        }

        const tradeTab: IMidaBrowserTab = await this._browser.openTab();

        await tradeTab.goto(`https://trade.bdswiss.com/?embedded=true&login=${this._account.ID}`);
        await tradeTab.exposeProcedure("_onTick", (plainTick: any): void => {
            this._onTick(plainTick);
        });
        await tradeTab.evaluate(`((w) => {
            const socket = new WebSocket("wss://mt4-api-demo.bdswiss.com/socket.io/?server=demo&EIO=3&transport=websocket");
            const loginDirectives = {
                login: "${this._account.ID}",
                version: 3,
                platform: "web",
            };
            
            socket.addEventListener("message", (event) => {
                try {
                    const message = JSON.parse(event.data.substr(2));
                    
                    if (message[0] === "TICK") {
                        _onTick(message[1]);
                    }
                }
                catch (error) {
                    // Silence is golden.
                }
            });
            
            socket.addEventListener("open", (event) => {
                socket.send('42["LOGIN",' + JSON.stringify(loginDirectives) + ']');
            });
            
            // Used to keep the connection alive.
            setInterval(() => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send("2");
                }
            }, 6000);
            
            w._MidaBroker = {
                socket,
            };
        })(window);`);

        await MidaUtilities.wait(5000);

        return tradeTab;
    }

    private _onTick (plainTick: any): void {
        const forexPairExchangeRate: MidaForexPairExchangeRate = {
            forexPair: MidaForexPairType.getByID(plainTick.s),
            date: new Date(),
            bid: plainTick.b,
            ask: plainTick.a,
        };

        if (isNaN(forexPairExchangeRate.bid) || isNaN(forexPairExchangeRate.ask)) {
            throw new Error();
        }

        this._lastTicks[forexPairExchangeRate.forexPair.ID] = forexPairExchangeRate;

        this.notifyEvent(MidaBrokerEventType.TICK, forexPairExchangeRate);
    }
}
