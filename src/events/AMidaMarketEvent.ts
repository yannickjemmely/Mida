import { MidaAssetQuotation } from "#asset/MidaAssetQuotation";

export abstract class AMidaMarketEvent {
    private readonly _listener: (...parameters: any[]) => any;

    protected constructor (listener: (...parameters: any[]) => any) {
        this._listener = listener;
    }

    protected notifyListener (...parameters: any[]): void {
        this._listener(...parameters);
    }

    public abstract update (quotation: MidaAssetQuotation): void;
}

/*
export class MidaMarketPriceBreakEvent extends AMidaAssetEvent {
    private readonly _priceToBreak: number;
    private _quotationBeforeBreak: MidaAssetQuotation | null;

    public constructor (priceToBreak: number, listener: (...parameters: any[]) => any) {
        super(listener);

        this._priceToBreak = priceToBreak;
        this._quotationBeforeBreak = null;
    }

    public get priceToBreak (): number {
        return this._priceToBreak;
    }

    public update (quotation: MidaAssetQuotation): void {
        if (!this._quotationBeforeBreak) {
            this._quotationBeforeBreak = quotation;

            return;
        }

        if (this._quotationBeforeBreak.bid <= this._priceToBreak) {
            if (quotation.bid > this._priceToBreak) {
                this.notifyListener(quotation, true);

                this._quotationBeforeBreak = quotation;
            }
        }
        else {
            if (quotation.bid < this._priceToBreak) {
                this.notifyListener(quotation, false);

                this._quotationBeforeBreak = quotation;
            }
        }
    }
}
*/
