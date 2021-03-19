import { MidaBrowserTab } from "#utilities/browser/MidaBrowserTab";

export class MetaTraderTab {
    private readonly _browserTab: MidaBrowserTab;

    public constructor (browserTab: MidaBrowserTab) {
        this._browserTab = browserTab;
    }
}
