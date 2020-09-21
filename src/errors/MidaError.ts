// Represents a generic error.
export class MidaError extends Error {
    public constructor (message?: string) {
        super(message);

        this.name = this.constructor.name;
    }
}
