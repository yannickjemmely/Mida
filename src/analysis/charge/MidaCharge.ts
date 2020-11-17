import { MidaChargeType } from "#analysis/charge/MidaChargeType";
import { MidaAssetPairQuotation  } from "#assets/MidaAssetPairQuotation";

// Represents a charge.
export class MidaCharge {
    // Represents the charge quotations.
    private readonly _quotations: MidaAssetPairQuotation[];

    // Represents the charge type.
    private readonly _type: MidaChargeType;

    public constructor (quotations: MidaAssetPairQuotation[], type: MidaChargeType) {
        this._quotations = quotations;
        this._type = type;
    }

    public get quotations (): readonly MidaAssetPairQuotation[] {
        return this._quotations;
    }

    public get type (): MidaChargeType {
        return this._type;
    }

    public get startTime (): Date {
        return new Date(this._quotations[0].time);
    }

    public get endTime (): Date {
        return new Date(this._quotations[this._quotations.length - 1].time);
    }

    public get length (): number {
        return this._quotations.length;
    }

    /*
     **
     *** Static Utilities
     **
    */

    public static fromQuotations (quotations: MidaAssetPairQuotation[], type: MidaChargeType): MidaCharge[] {
        const charges: MidaCharge[] = [];

        for (let i: number = 0, length: number = quotations.length - 1; i < length; ++i) {
            const chargeQuotations: MidaAssetPairQuotation[] = [];

            while (
                quotations[i + 1] && (
                    (type === MidaChargeType.BEARISH && quotations[i + 1].bid < quotations[i].bid) ||
                    (type === MidaChargeType.BULLISH && quotations[i + 1].bid > quotations[i].bid)
                )
            ) {
                chargeQuotations.push(quotations[i + 1]);

                ++i;
            }

            if (chargeQuotations.length > 0) {
                charges.push(new MidaCharge(chargeQuotations, type));
            }
        }

        return charges;
    }
}
