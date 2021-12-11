import { MidaError } from "#errors/MidaError";

export class MidaUnsupportedOperationError extends MidaError {
    public constructor () {
        super({
            type: "MidaUnsupportedOperationError",
            message: "This operation is not supported yet.",
        });
    }
}
