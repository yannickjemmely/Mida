// Represents a set of elements.
export class MidaSet<T> {
    private readonly _calcHash: (element: T) => string;
    private readonly _elements: Map<string, T>;

    public constructor (calcHash: (element: T) => string, elements: T[] = []) {
        this._calcHash = calcHash;
        this._elements = new Map<string, T>();

        for (const element of elements) {
            this.add(element);
        }
    }

    public add (element: T): void {
        this._elements.set(this._calcHash(element), element);
    }

    public get (hash: string): T | null {
        return this._elements.get(hash) || null;
    }

    public has (hash: string): boolean {
        return this._elements.has(hash);
    }

    public remove (hash: string): void {
        this._elements.delete(hash);
    }

    public clear (): void {
        this._elements.clear();
    }

    public get length (): number {
        return this._elements.size;
    }

    public toArray (): T[] {
        return [ ...this._elements.values() ];
    }
}
