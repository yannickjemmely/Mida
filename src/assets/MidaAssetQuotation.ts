import { MidaAsset } from "#assets/MidaAsset";
import { IMidaEquatable } from "#utilities/IMidaEquatable";
import { IMidaClonable } from "#utilities/IMidaClonable";

// Represents an asset quotation.
export class MidaAssetQuotation implements IMidaEquatable<MidaAssetQuotation>, IMidaClonable<MidaAssetQuotation> {
    // Represents the quotation asset.
    private readonly _asset: MidaAsset;

    // Represents the quotation time.
    private readonly _time: Date;

    // Represents the quotation bid price.
    private readonly _bid: number;

    // Represents the quotation ask price.
    private readonly _ask: number;

    public constructor (asset: MidaAsset, time: Date, bid: number, ask: number) {
        this._asset = asset;
        this._time = time;
        this._bid = bid;
        this._ask = ask;
    }

    public get asset (): MidaAsset {
        return this._asset;
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

    public get spread (): number {
        return this._ask - this._bid;
    }

    public equals (quotation: MidaAssetQuotation): boolean {
        return this._time.valueOf() === quotation._time.valueOf() && this._asset.equals(quotation._asset);
    }

    public clone (): MidaAssetQuotation {
        return new MidaAssetQuotation(this._asset.clone(), new Date(this._time), this._bid, this._ask);
    }

    public static getQuotationsOpenBid (quotations: MidaAssetQuotation[]): number {
        return quotations[0].bid;
    }

    public static getQuotationsOpenAsk (quotations: MidaAssetQuotation[]): number {
        return quotations[0].ask;
    }

    public static getQuotationsCloseBid (quotations: MidaAssetQuotation[]): number {
        return quotations[quotations.length - 1].bid;
    }

    public static getQuotationsCloseAsk (quotations: MidaAssetQuotation[]): number {
        return quotations[quotations.length - 1].ask;
    }

    public static getQuotationsHighestBid (quotations: MidaAssetQuotation[]): number {
        let highestBid: number = quotations[0].bid;

        for (let i: number = 1; i < quotations.length; ++i) {
            if (quotations[i].bid > highestBid) {
                highestBid = quotations[i].bid;
            }
        }

        return highestBid;
    }

    public static getQuotationsHighestAsk (quotations: MidaAssetQuotation[]): number {
        let highestAsk: number = quotations[0].ask;

        for (let i: number = 1; i < quotations.length; ++i) {
            if (quotations[i].ask > highestAsk) {
                highestAsk = quotations[i].ask;
            }
        }

        return highestAsk;
    }

    public static getQuotationsLowestBid (quotations: MidaAssetQuotation[]): number {
        let lowestBid: number = quotations[0].bid;

        for (let i: number = 1; i < quotations.length; ++i) {
            if (quotations[i].bid < lowestBid) {
                lowestBid = quotations[i].bid;
            }
        }

        return lowestBid;
    }

    public static getQuotationsLowestAsk (quotations: MidaAssetQuotation[]): number {
        let lowestAsk: number = quotations[0].ask;

        for (let i: number = 1; i < quotations.length; ++i) {
            if (quotations[i].ask < lowestAsk) {
                lowestAsk = quotations[i].ask;
            }
        }

        return lowestAsk;
    }
}
