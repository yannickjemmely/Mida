import { MidaAssetPairPeriod } from "#assets/MidaAssetPairPeriod";
import { MidaAssetPairPeriodType } from "#assets/MidaAssetPairPeriodType";
import { MidaAssetPairTick } from "#assets/MidaAssetPairTick";
import { MidaBroker } from "#brokers/MidaBroker";
import { MidaBrokerAccount } from "#brokers/MidaBrokerAccount";
import { MidaBrokerAccountType } from "#brokers/MidaBrokerAccountType";
import { MidaBrowser } from "#browsers/MidaBrowser";
import { MidaBrowserTab } from "#browsers/MidaBrowserTab";
import { MidaPosition } from "#positions/MidaPosition";
import { MidaPositionDirectives } from "#positions/MidaPositionDirectives";

export class BdSwissBrokerAccount extends MidaBrokerAccount {
    // Represents the broker browser used internally to navigate the website.
    private readonly _browser: MidaBrowser;

    // Represents the broker browser tabs used to perform actions on the website.
    private readonly _browserTabs: {
        [name: string]: MidaBrowserTab;
    };

    // Represents the broker account last ticks.
    private readonly _lastTicks: Map<string, MidaAssetPairTick>;

    // Indicates if the periods of an asset pair are being requested.
    private _isAssetPairPeriodsBusy: boolean;

    // Represents the broker asset pair periods requests queue.
    private readonly _assetPairPeriodsRequests: ((...parameters: any[]) => void)[];

    public constructor (id: string, name: string, type: MidaBrokerAccountType, broker: MidaBroker, browserTabs: any) {
        super(id, name, type, broker);

        this._browser = browserTabs.tradeTab.browser;
        this._browserTabs = browserTabs;
        this._lastTicks = new Map();
        this._isAssetPairPeriodsBusy = false;
        this._assetPairPeriodsRequests = [];
    }

    public async openPosition (directives: MidaPositionDirectives): Promise<MidaPosition> {
        const positionUUID: string = generatePositionUuid();
        const openDescriptor: any = await this._browserTabs.tradeTab.evaluate(`((w) => {
            const socket = w._MidaBroker.socket;
            const openDirectives = {
                symbol: "${directives.forexPair.id2}",
                volume: ${directives.lots},
                uuid: "${positionUUID}",
                platform: "BDS.WT",
                cmd: "${directives.direction}",
            };
            
            if (${directives.takeProfit !== undefined}) {
                openDirectives.tp = ${directives.takeProfit};
            }
            
            if (${directives.stopLoss !== undefined}) {
                openDirectives.sl = ${directives.stopLoss};
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
            directives: directives,
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

    /*
    public async getCurrency (): Promise<MidaCurrency> {
        const currencySymbol: string = await this._browserTabs.tradeTab.evaluate(`(() => {
            return window.document.querySelector("[data-cy=equity]").innerText.trim().split(" ")[0];
        })();`);

        return MidaCurrencyType.getBySymbol(currencySymbol);
    }
    */

    public async getSymbolLastTick (symbol: string): Promise<MidaAssetPairTick> {
        const lastTick: MidaAssetPairTick | undefined = this._lastTicks.get(symbol);

        if (lastTick) {
            return lastTick;
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

    public async getSymbolPeriods (symbol: string, type: MidaAssetPairPeriodType): Promise<MidaAssetPairPeriod[]> {
        if (this._isAssetPairPeriodsBusy) {
            await new Promise((resolve: (...parameters: any[]) => void): void => {
                this._assetPairPeriodsRequests.push(resolve);
            });
        }
        else {
            this._isAssetPairPeriodsBusy = true;
        }

        const periods: MidaAssetPairPeriod[] = [];
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
                    resolve();
                }, 20000);
                
                socket.addEventListener("message", listener);
                socket.send('42["GET_CHART",{"resolution":${type},"symbol":"${symbol}"}]');
            });
        })(window);`);

        const nextRequest: ((...parameters: any[]) => void) | undefined = this._assetPairPeriodsRequests.shift();

        if (nextRequest) {
            nextRequest();
        }
        else {
            this._isAssetPairPeriodsBusy = false;
        }

        if (!plainPeriods) {
            throw new Error();
        }

        plainPeriods.sort((left: any, right: any): number => left.t - right.t);

        for (const plainPeriod of plainPeriods) {
            periods.push({
                undefined,
                type: type,
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

    private async _getOrderProfit (orderId: string): Promise<number> {
        const profit: number = parseFloat(await this._browserTabs.positionsTab.evaluate(`(() => {
            try {
                const rowSelector = ".rt-td > [title='${orderId}']";
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

    private async _setupTradeTab (): Promise<void> {
        const tradeTab: MidaBrowserTab = this._browserTabs.tradeTab;

        await tradeTab.exposeProcedure("_onTick", (plainTick: any): void => {
            this._onTick(plainTick);
        });
        await tradeTab.exposeProcedure("_onPositionClose", (closeDescriptor: any): void => {
            this._onPositionClose(closeDescriptor);
        });
        await tradeTab.evaluate(`((w) => {
            const socket = new WebSocket("wss://mt4-api-demo.bdswiss.com/socket.io/?server=demo&EIO=3&transport=websocket");
            const loginDirectives = {
                login: "${this.id}",
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
    }

    private _onTick (plainTick: any): void {
        const forexPairExchangeRate: MidaForexPairExchangeRate = {
            forexPair: MidaForexPairType.getBySymbol(plainTick.s),
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
    }
}
