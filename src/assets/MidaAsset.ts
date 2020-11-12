import { IMidaEquatable } from "#utilities/IMidaEquatable";
import { IMidaClonable } from "#utilities/IMidaClonable";

// Represents an asset.
export class MidaAsset implements IMidaEquatable, IMidaClonable<MidaAsset> {
    // Represents the asset id.
    private readonly _id: string;

    // Represents the asset name.
    private readonly _name: string;

    // Represents the asset description.
    private readonly _description: string;

    // Represents the asset unit name.
    private readonly _unitName: string;

    public constructor (id: string, name: string = "", description: string = "", unitName: string = "") {
        this._id = id;
        this._name = name;
        this._description = description;
        this._unitName = unitName;
    }

    public get id (): string {
        return this._id;
    }

    public get name (): string {
        return this._name;
    }

    public get description (): string {
        return this._description;
    }

    public get unitName (): string {
        return this._unitName;
    }

    public equals (object: any): boolean {
        return (
            object instanceof MidaAsset
            && this._id === object._id
        );
    }

    public clone (): MidaAsset {
        return new MidaAsset(this._id, this._name, this._description);
    }
}
