import { MidaAssetPair } from "#assets/MidaAssetPair";
import { IMidaEquatable } from "#utilities/IMidaEquatable";
import { IMidaClonable } from "#utilities/IMidaClonable";

// Represents an asset pair quotation.
export class MidaAssetPairQuotation implements IMidaEquatable, IMidaClonable<MidaAssetPairQuotation> {
    // Represents the quotation asset pair.
    private readonly _assetPair: MidaAssetPair;

    // Represents the quotation time.
    private readonly _time: Date;

    // Represents the quotation bid price.
    private readonly _bid: number;

    // Represents the quotation ask price.
    private readonly _ask: number;

    public constructor (assetPair: MidaAssetPair, time: Date, bid: number, ask: number) {
        this._assetPair = assetPair;
        this._time = new Date(time);
        this._bid = bid;
        this._ask = ask;
    }

    public get assetPair (): MidaAssetPair {
        return this._assetPair;
    }

    public get time (): Date {
        return new Date(this._time);
    }

    public get bid (): number {
        return this._bid;
    }

    public get ask (): number {
        return this._ask;
    }

    public get symbol (): string {
        return this._assetPair.symbol;
    }

    public get spread (): number {
        return this._ask - this._bid;
    }

    public equals (object: any): boolean {
        return (
            object instanceof MidaAssetPairQuotation
            && this._time.valueOf() === object._time.valueOf()
            && this._assetPair.equals(object._assetPair)
        );
    }

    public clone (): MidaAssetPairQuotation {
        return new MidaAssetPairQuotation(this._assetPair.clone(), this._time, this._bid, this._ask);
    }

    /*
     **
     *** Static Utilities
     **
    */

    public static getQuotationsOpenBid (quotations: MidaAssetPairQuotation[]): number {
        return quotations[0].bid;
    }

    public static getQuotationsOpenAsk (quotations: MidaAssetPairQuotation[]): number {
        return quotations[0].ask;
    }

    public static getQuotationsCloseBid (quotations: MidaAssetPairQuotation[]): number {
        return quotations[quotations.length - 1].bid;
    }

    public static getQuotationsCloseAsk (quotations: MidaAssetPairQuotation[]): number {
        return quotations[quotations.length - 1].ask;
    }

    public static getQuotationsHighestBid (quotations: MidaAssetPairQuotation[]): number {
        let highestBid: number = quotations[0].bid;

        for (let i: number = 1; i < quotations.length; ++i) {
            if (quotations[i].bid > highestBid) {
                highestBid = quotations[i].bid;
            }
        }

        return highestBid;
    }

    public static getQuotationsHighestAsk (quotations: MidaAssetPairQuotation[]): number {
        let highestAsk: number = quotations[0].ask;

        for (let i: number = 1; i < quotations.length; ++i) {
            if (quotations[i].ask > highestAsk) {
                highestAsk = quotations[i].ask;
            }
        }

        return highestAsk;
    }

    public static getQuotationsLowestBid (quotations: MidaAssetPairQuotation[]): number {
        let lowestBid: number = quotations[0].bid;

        for (let i: number = 1; i < quotations.length; ++i) {
            if (quotations[i].bid < lowestBid) {
                lowestBid = quotations[i].bid;
            }
        }

        return lowestBid;
    }

    public static getQuotationsLowestAsk (quotations: MidaAssetPairQuotation[]): number {
        let lowestAsk: number = quotations[0].ask;

        for (let i: number = 1; i < quotations.length; ++i) {
            if (quotations[i].ask < lowestAsk) {
                lowestAsk = quotations[i].ask;
            }
        }

        return lowestAsk;
    }

    public static quotationsHaveSameAssetPair (quotations: MidaAssetPairQuotation[]): boolean {
        const firstAssetPair: MidaAssetPair = quotations[0].assetPair;

        for (let i: number = 1; i < quotations.length; ++i) {
            if (!quotations[i].assetPair.equals(firstAssetPair)) {
                return false;
            }
        }

        return true;
    }
}
