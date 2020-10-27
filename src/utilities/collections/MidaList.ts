// Represents a list of elements.
export class MidaList<T> {
    private readonly _elements: T[];

    public constructor (elements: T[] = []) {
        this._elements = elements;
    }

    public get length (): number {
        return this._elements.length;
    }

    public add (element: T): void {
        this._elements.push(element);
    }

    public get (index: number): T | null {
        return this._elements[index] || null;
    }

    public remove (index: number): void {
        this._elements.splice(index, 1);
    }

    public toArray (): readonly T[] {
        return this._elements;
    }
}

// Represents a readonly list of elements.
export class MidaReadonlyList<T> {
    private readonly _list: MidaList<T>;

    public constructor (elements: T[]) {
        this._list = new MidaList<T>(elements);
    }

    public get length (): number {
        return this._list.length;
    }

    public get (index: number): T | null {
        return this._list.get(index);
    }

    public toArray (): readonly T[] {
        return this._list.toArray();
    }
}
