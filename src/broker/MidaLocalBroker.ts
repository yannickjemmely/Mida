import { AMidaBroker } from "#broker/AMidaBroker";
import { MidaBrokerAccountType } from "#broker/MidaBrokerAccountType";
import { MidaForexPairExchangeRate } from "#forex/MidaForexPairExchangeRate";
import { MidaForexPairPeriod } from "#forex/MidaForexPairPeriod";
import { MidaPositionDirectionType } from "#position/MidaPositionDirectionType";
import { MidaPosition } from "#position/MidaPosition";
import { MidaPositionSet } from "#position/MidaPositionSet";
import {MidaForexPair} from "#forex/MidaForexPair";

// @ts-ignore
export class MidaLocalBroker extends AMidaBroker {
    private readonly _forexPairsTicks: {
        [forexPairID: string]: {
            ticks: MidaForexPairExchangeRate[];
            actualTickIndex: number;
        };
    };

    private readonly _positions: MidaPositionSet;

    private _balance: number;
    private _equity: number;

    public constructor () {
        super();

        this._forexPairsTicks = {};
        this._positions = new MidaPositionSet();
        this._balance = 10000;
        this._equity = this._balance;
    }

    public get isLoggedIn (): boolean {
        return true;
    }

    public get accountID (): string {
        return "";
    }

    public get accountType (): MidaBrokerAccountType {
        return MidaBrokerAccountType.DEMO;
    }

    public get name (): string {
        return "MidaLocalBroker";
    }

    public async login (): Promise<void> {
        throw new Error();
    }

    public async getBalance (): Promise<number> {
        return this._balance;
    }

    public async resetBalance (): Promise<void> {
        this._balance = 10000;
    }

    // Very Important Notice:
    // All the ticks passed as parameter must be ordered from oldest to newest.
    public loadTicks (ticks: MidaForexPairExchangeRate[]): void {
        this._forexPairsTicks[ticks[0].forexPair.ID] = {
            ticks: ticks,
            actualTickIndex: -1,
        };
    }

    public hasTick (forexPair: MidaForexPair): boolean {
        if (!this._forexPairsTicks[forexPair.ID]) {
            return false;
        }

        return this._forexPairsTicks[forexPair.ID].actualTickIndex < this._forexPairsTicks[forexPair.ID].ticks.length - 1;
    }

    public nextTick (forexPair: MidaForexPair): void {
        this._onTick(this._forexPairsTicks[forexPair.ID].ticks[++this._forexPairsTicks[forexPair.ID].actualTickIndex]);
    }

    private _onTick (exchangeRate: MidaForexPairExchangeRate): void {
        for (const position of this._positions.toArray()) {
            const stopLoss: number | undefined = position.directives.stopLoss;
            const takeProfit: number | undefined = position.directives.takeProfit;

            if (position.directives.direction === MidaPositionDirectionType.BUY) {
                if ((typeof stopLoss === "number" && exchangeRate.bid <= stopLoss) || (typeof takeProfit === "number" && exchangeRate.bid >= takeProfit)) {
                    position.close();
                }
            }
            else {
                if ((typeof stopLoss === "number" && exchangeRate.ask <= stopLoss) || (typeof takeProfit === "number" && exchangeRate.ask >= takeProfit)) {
                    position.close();
                }
            }
        }
    }
}
