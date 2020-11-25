export class MidaFX {
    private static readonly _midaPackage: any = require("!/package.json");

    private constructor () {
        // Silence is golden.
    }

    public static get moduleName (): string {
        return MidaFX._midaPackage.name;
    }

    public static get version (): string {
        return MidaFX._midaPackage.version;
    }

    public static get description (): string {
        return MidaFX._midaPackage.description;
    }
}
