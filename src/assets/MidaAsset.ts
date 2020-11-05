import { IMidaEquatable } from "#utilities/IMidaEquatable";
import { IMidaClonable } from "#utilities/IMidaClonable";

// Represents an asset.
export class MidaAsset implements IMidaEquatable<MidaAsset>, IMidaClonable<MidaAsset> {
    // Represents the asset id.
    private readonly _id: string;

    // Represents the asset description.
    private readonly _description: string;

    public constructor (id: string, description: string = "") {
        this._id = id;
        this._description = description;
    }

    public get id (): string {
        return this._id;
    }

    public get description (): string {
        return this._description;
    }

    public equals (asset: MidaAsset): boolean {
        return this._id === asset._id;
    }

    public clone (): MidaAsset {
        return new MidaAsset(this._id, this._description);
    }
}
