import { OkxAccount, } from "!/src/platforms/okx/OkxAccount";
import { MidaTradingPlatform, } from "#platforms/MidaTradingPlatform";
import { baseActions, } from "#plugins/MidaPluginActions";

/** Used as internal map to cache logged accounts */
const loggedAccounts: Map<string, OkxAccount> = new Map();
const platformDescriptor: Record<string, any> = {
    name: "OKX",
    siteUri: "https://okx.com",
    primaryAsset: "USDT",
};

// @ts-ignore
export class Okx extends MidaTradingPlatform {
    private constructor () {
        super({ name: platformDescriptor.name, siteUri: platformDescriptor.siteUri, });
    }

    /* *** *** *** Reiryoku Technologies *** *** *** */

    static #instance: Okx = new Okx();

    public static get instance (): Okx {
        return this.#instance;
    }
}

baseActions.addPlatform("OKX", Okx.instance);
