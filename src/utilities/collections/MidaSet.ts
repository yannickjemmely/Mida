// Represents a set of elements.
export class MidaSet<T> {
    private readonly _getHash: (element: T) => string;
    private readonly _elements: {
        [hash: string]: T;
    };

    public constructor (getHash: (element: T) => string, elements?: any[]) {
        this._getHash = getHash;
        this._elements = {};

        if (elements) {
            for (const element of elements) {
                this.add(element);
            }
        }
    }

    public get length (): number {
        return Object.keys(this._elements).length;
    }

    public add (element: T): void {
        this._elements[this._getHash(element)] = element;
    }

    public get (hash: string): T | null {
        return this._elements[hash] || null;
    }

    public has (hash: string): boolean {
        return this.get(hash) !== null;
    }

    public remove (hash: string): void {
        delete this._elements[hash];
    }

    public clear (): void {
        Object.keys(this._elements).forEach((hash: string): void => {
            this.remove(hash);
        });
    }

    public toArray (): T[] {
        return Object.values(this._elements);
    }
}
