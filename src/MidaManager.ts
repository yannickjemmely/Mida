export class MidaManager {
    private static readonly _midaPackage: any = require("!/package.json");

    private constructor () {
        // Silence is golden.
    }

    public static get version (): string {
        return MidaManager._midaPackage.version;
    }

    public static get description (): string {
        return MidaManager._midaPackage.description;
    }
}
