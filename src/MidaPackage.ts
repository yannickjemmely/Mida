import { GenericObject } from "#utilities/GenericObject";

const PACKAGE_FILE_PATH: string = "!/package.json";

export class MidaPackage {
    private static readonly _midaPackage: GenericObject = require(PACKAGE_FILE_PATH);

    private constructor () {
        // Silence is golden.
    }

    public static get version (): string {
        return MidaPackage._midaPackage.version;
    }

    public static get description (): string {
        return MidaPackage._midaPackage.description;
    }
}
