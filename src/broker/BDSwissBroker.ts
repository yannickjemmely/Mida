import { AMidaBroker } from "#broker/AMidaBroker";
import { MidaBrokerAccountType } from "#broker/MidaBrokerAccountType";
import { MidaBrokerEventType } from "#broker/MidaBrokerEventType";
import { IMidaBrowser } from "#browser/IMidaBrowser";
import { IMidaBrowserTab } from "#browser/IMidaBrowserTab";
import { ChromiumBrowser } from "#browser/ChromiumBrowser";
import { MidaCurrency } from "#currency/MidaCurrency";
import { MidaCurrencyType } from "#currency/MidaCurrencyType";
import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaForexPairExchangeRate } from "#forex/MidaForexPairExchangeRate";
import { MidaAssetPeriod } from "#forex/MidaAssetPeriod";
import { MidaForexPairPeriodType } from "#forex/MidaForexPairPeriodType";
import { MidaForexPairType } from "#forex/MidaForexPairType";
import { MidaPosition, generatePositionUuid } from "#position/MidaPosition";
import { MidaPositionDirectives } from "#position/MidaPositionDirectives";
import { MidaPositionSet } from "#position/MidaPositionSet";
import { MidaPositionStatusType } from "#position/MidaPositionStatusType";
import { MidaProtectedObservable } from "#utilities/observable/AMidaObservable";

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

    // Represents the account type.
    private _accountType: MidaBrokerAccountType;

    // Indicates if an account is logged in.
    private _isLoggedIn: boolean;

    // Represents the positions created through this broker.
    private readonly _positions: MidaPositionSet;

    // Represents the forex pair tick listeners.
    private readonly _forexPairTickListeners: MidaProtectedObservable<string>;

    // Represents the forex pair period listeners.
    private readonly _forexPairPeriodListeners: MidaProtectedObservable<string>;

    // Represents the last ticks.
    private readonly _lastTicks: {
        [forexPairID: string]: MidaForexPairExchangeRate;
    };

    // Indicates if the periods of a forex pair are being requested.
    private _isForexPairPeriodsBusy: boolean;

    // Represents the forex pair periods requests queue.
    private readonly _forexPairPeriodsRequests: ((...parameters: any[]) => void)[];

    public constructor () {
        super();

        this._browser = new ChromiumBrowser();
        this._browserTabs = {};
        this._account = null;
        this._accountType = MidaBrokerAccountType.ANONYMOUS;
        this._isLoggedIn = false;
        this._positions = new MidaPositionSet();
        this._forexPairTickListeners = new MidaProtectedObservable();
        this._forexPairPeriodListeners = new MidaProtectedObservable();
        this._lastTicks = {};
        this._isForexPairPeriodsBusy = false;
        this._forexPairPeriodsRequests = [];
    }

    public get isLoggedIn (): boolean {
        return this._isLoggedIn;
    }

    public get accountId (): string {
        return this._account.ID;
    }

    public get accountType (): MidaBrokerAccountType {
        return this._accountType;
    }

    public get name (): string {
        return BDSwissBroker.NAME;
    }

    public async login (account: any): Promise<void> {
        if (this._isLoggedIn) {
            throw new Error();
        }

        await this._browser.open();

        // TODO: Close the login tab in a safe way and delete the password after using it.
        const loginTab: IMidaBrowserTab = await this._browser.openTab();
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
        this._accountType = await this._getAccountType();

        loginTab.close();

        this.notifyEvent(MidaBrokerEventType.LOGIN, this);
    }

    public async openPosition (positionDirectives: MidaPositionDirectives): Promise<MidaPosition> {
        const positionUUID: string = generatePositionUuid();
        const openDescriptor: any = await this._browserTabs.tradeTab.evaluate(`((w) => {
            const socket = w._MidaBroker.socket;
            const openDirectives = {
                symbol: "${positionDirectives.forexPair.id2}",
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

        const openProfit: number = 0; // await this._getPositionProfitByOrderID(openDescriptor.orderID);
        
        const position: MidaPosition = {
            uuid: positionUUID,
            broker: {
                name: this.name,
                accountId: this.accountId,
                positionId: openDescriptor.orderID,
            },
            directives: positionDirectives,
            status: MidaPositionStatusType.OPEN,
            openDate: new Date(),
            openPrice: openDescriptor.openPrice,
            closeDate: null,
            closePrice: null,
            lowestProfit: openProfit,
            highestProfit: openProfit,
            profit: async (): Promise<number> => this._getPositionProfitByOrderID(openDescriptor.orderID),
            commission: async (): Promise<number> => openDescriptor.commission,
            swaps: async (): Promise<number> => openDescriptor.swaps,
            currency: async (): Promise<MidaCurrency> => this.getCurrency(),
            close: async (): Promise<void> => this.closePositionByUuid(positionUUID),
        };

        this._positions.add(position);
        this.notifyEvent(MidaBrokerEventType.POSITION_OPEN, position);

        return position;
    }

    public async getPositionByUuid (UUID: string): Promise<MidaPosition | null> {
        return this._positions.get(UUID);
    }

    public async getPositionByOrderID (orderID: string): Promise<MidaPosition | null> {
        for (const position of this._positions.toArray()) {
            if (position.broker.positionId === orderID) {
                return position;
            }
        }

        return null;
    }

    public async closePositionByUuid (UUID: string): Promise<void> {
        const position: MidaPosition | null = await this.getPositionByUuid(UUID);

        if (!position) {
            throw new Error();
        }

        await this._browserTabs.tradeTab.evaluate(`((w) => {
            const socket = w._MidaBroker.socket;
            const closeDirectives = {
                order: ${position.broker.positionId},
                volume: ${position.directives.lots},
                uuid: "${UUID}",
            };
            
            socket.send('42["CLOSE_TRADE",' + JSON.stringify(closeDirectives) + ']');
        })(window);`);
    }

    public async getPositionsByStatus (status: MidaPositionStatusType): Promise<MidaPosition[]> {
        return this._positions.toArray().filter((position: MidaPosition): boolean => position.status === status);
    }

    public async getBalance (): Promise<number> {
        const plainBalance: number = parseFloat(await this._browserTabs.tradeTab.evaluate(`(() => {
            return window.document.querySelectorAll(".account__total")[0].innerText.trim().split(" ")[1].replace(/,/g, "");
        })();`));

        if (isNaN(plainBalance)) {
            throw new Error();
        }

        return plainBalance;
    }

    public async resetBalance (): Promise<void> {
        throw new Error();
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

    public async getFreeMargin (): Promise<number> {
        const plainFreeMargin: number = parseFloat(await this._browserTabs.tradeTab.evaluate(`(() => {
            return window.document.querySelectorAll(".equity__subprime__amount")[1].innerText.trim().split(" ")[1].replace(/,/g, "");
        })();`));

        if (isNaN(plainFreeMargin)) {
            throw new Error();
        }

        return plainFreeMargin;
    }

    public async getCurrency (): Promise<MidaCurrency> {
        const currencySymbol: string = await this._browserTabs.tradeTab.evaluate(`(() => {
            return window.document.querySelector("[data-cy=equity]").innerText.trim().split(" ")[0];
        })();`);

        return MidaCurrencyType.getBySymbol(currencySymbol);
    }

    public async getForexPairExchangeRate (forexPair: MidaForexPair): Promise<MidaForexPairExchangeRate> {
        if (this._lastTicks[forexPair.id]) {
            return this._lastTicks[forexPair.id];
        }

        return new Promise((resolve: any): void => {
            const listenerUUID: string = this.addForexPairTickListener(forexPair, (forexPairExchangeRate: MidaForexPairExchangeRate): void => {
                this.removeForexPairTickListener(listenerUUID);
                resolve(forexPairExchangeRate);
            });
        });
    }

    public addForexPairTickListener (forexPair: MidaForexPair, listener: (forexPairExchangeRate: MidaForexPairExchangeRate) => void): string {
        this._browserTabs.tradeTab.evaluate(`((w) => {
            const socket = w._MidaBroker.socket;
            
            socket.send('42["SUBSCRIBE",{"symbol":"${forexPair.id2}"}]');
        })(window);`);

        return this._forexPairTickListeners.addEventListener(forexPair.id, listener);
    }

    public removeForexPairTickListener (listenerUUID: string): boolean {
        return this._forexPairTickListeners.removeEventListener(listenerUUID);
    }

    public addForexPairPeriodListener (forexPair: MidaForexPair, listener: (forexPairPeriod: MidaAssetPeriod) => void): string {
        return this._forexPairPeriodListeners.addEventListener(forexPair.id, listener);
    }

    public removeForexPairPeriodListener (listenerUUID: string): boolean {
        return this._forexPairPeriodListeners.removeEventListener(listenerUUID);
    }

    public async getForexPairPeriods (forexPair: MidaForexPair, periodsType: MidaForexPairPeriodType): Promise<MidaAssetPeriod[]> {
        if (this._isForexPairPeriodsBusy) {
            await new Promise((resolve: (...parameters: any[]) => void): void => {
                this._forexPairPeriodsRequests.push(resolve);
            });
        }
        else {
            this._isForexPairPeriodsBusy = true;
        }

        const periods: MidaAssetPeriod[] = [];
        const plainPeriods: any[] = await this._browserTabs.tradeTab.evaluate(`((w) => {
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
                socket.send('42["GET_CHART",{"resolution":${periodsType},"symbol":"${forexPair.id2}"}]');
            });
        })(window);`);

        const nextRequest: ((...parameters: any[]) => void) | undefined = this._forexPairPeriodsRequests.shift();

        if (nextRequest) {
            nextRequest();
        }
        else {
            this._isForexPairPeriodsBusy = false;
        }

        if (!plainPeriods) {
            throw new Error();
        }

        plainPeriods.sort((left: any, right: any): number => left.t - right.t);

        for (const plainPeriod of plainPeriods) {
            periods.push({
                forexPair,
                type: periodsType,
                time: new Date((new Date(plainPeriod.t.replace(/-/g, "/"))).valueOf() - 60 * 60 * 1000 * 2),
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
        if (!this._isLoggedIn) {
            throw new Error();
        }

        await this._browser.close();

        this._browserTabs = {};
        this._account = null;
        this._isLoggedIn = false;

        this._positions.clear();

        this.notifyEvent(MidaBrokerEventType.LOGOUT, this);
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
        await tradeTab.exposeProcedure("_onPositionClose", (closeDescriptor: any): void => {
           this._onPositionClose(closeDescriptor);
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

            socket.addEventListener("message", (event) => {
                try {
                    if (event.data.indexOf("ORDER_CLOSED") === -1) {
                        return;
                    }

                    const message = JSON.parse(event.data.substr(2));
                    const position = message[1];

                    _onPositionClose({
                        orderID: position.order,
                        closePrice: position.closePrice,
                        profit: position.mt4Profit,
                        commission: position.commission,
                        swaps: position.swaps,
                    });
                }
                catch (error) {
                    // Silence is golden.
                }
             });

            // Used to keep the connection alive.
            setInterval(() => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send("2");
                }
            }, 5000);

            w._MidaBroker = {
                socket,
            };

            return new Promise((resolve) => {
                socket.addEventListener("open", (event) => {
                    resolve();
                    socket.send('42["LOGIN",' + JSON.stringify(loginDirectives) + ']');
                });
            });
        })(window);`);

        return tradeTab;
    }

    private async _getAccountType (): Promise<MidaBrokerAccountType> {
        await this._browserTabs.tradeTab.waitForSelector(".account__name");

        const plainAccountType: string = await this._browserTabs.tradeTab.evaluate(`((w) => {
            return w.document.querySelectorAll(".account__name")[0].innerText.trim();
        })(window);`);

        if (plainAccountType === "Practice Account") {
            return MidaBrokerAccountType.DEMO;
        }

        return MidaBrokerAccountType.REAL;
    }

    private _onTick (plainTick: any): void {
        const forexPairExchangeRate: MidaForexPairExchangeRate = {
            forexPair: MidaForexPairType.getById(plainTick.s),
            time: new Date(),
            bid: plainTick.b,
            ask: plainTick.a,
            spread: plainTick.a - plainTick.b,
        };

        if (isNaN(forexPairExchangeRate.bid) || isNaN(forexPairExchangeRate.ask)) {
            throw new Error();
        }

        this._lastTicks[forexPairExchangeRate.forexPair.id] = forexPairExchangeRate;

        this._forexPairTickListeners.notifyEvent(forexPairExchangeRate.forexPair.id, forexPairExchangeRate);
    }

    private async _onPositionClose (closeDescriptor: any): Promise<void> {
        const position: MidaPosition | null = await this.getPositionByOrderID(closeDescriptor.orderID);

        if (!position) {
            return;
        }

        position.status = MidaPositionStatusType.CLOSE;
        position.closeDate = new Date();
        position.closePrice = closeDescriptor.closePrice;
        position.profit = async (): Promise<number> => closeDescriptor.profit;
        position.commission = async (): Promise<number> => closeDescriptor.commission;
        position.swaps = async (): Promise<number> => closeDescriptor.swaps;

        this.notifyEvent(MidaBrokerEventType.POSITION_CLOSE, position);
    }
}
