import { GenericObject } from "#utilities/GenericObject";

export class Mida {
    private static readonly _PACKAGE: GenericObject = require("!/package.json");

    private constructor () {
        // Silence is golden.
    }

    /** The module version. */
    public static get version (): string {
        return Mida._PACKAGE.version;
    }
}

export { MidaSymbolPeriod } from "#periods/MidaSymbolPeriod";
export { MidaSymbolPeriodParameters} from "#periods/MidaSymbolPeriodParameters";
export { MidaSymbolPeriodTimeframeType } from "#periods/MidaSymbolPeriodTimeframeType";