// Represents a generic Mida error.
export class MidaError extends Error {
    public constructor (text?: string) {
        super(text);
        
        this.name = this.constructor.name;
    }
}
