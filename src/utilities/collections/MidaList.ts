// Represents a list of elements.
export class MidaList<T> extends Array<T> {
    public constructor (elements: T[]) {
        super(...elements);
    }
}
