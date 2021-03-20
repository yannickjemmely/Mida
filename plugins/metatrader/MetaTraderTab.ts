import { MidaBrowserTab } from "#utilities/browser/MidaBrowserTab";
import { MidaEvent } from "#events/MidaEvent";
import { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
import { MidaBrokerOrder } from "#orders/MidaBrokerOrder";

export class MetaTraderTab {
    private readonly _browserTab: MidaBrowserTab;

    public constructor (browserTab: MidaBrowserTab) {
        this._browserTab = browserTab;
    }

    public async applyDependencies (): Promise<void> {

    }

    public async getOrders (): Promise<any[]> {
        let orders: any[];

        try {
            orders = await this._browserTab.evaluate("[ ...window.B.Oa.Xa.A.ff, ...window.B.Oa.Xa.A.history, ]");
        }
        catch (error) {
            return [];
        }

        if (!Array.isArray(orders)) {
            throw new Error();
        }

        return orders;
    }

    public async placeOrder (): Promise<any> {

    }
}
