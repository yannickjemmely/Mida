import { MidaTrace } from "#tracer/MidaTrace";

export class MidaTracer {
    private static _traces: MidaTrace[] = [];

    private constructor () {
        // Silence is golden.
    }

    public static trace (trace: MidaTrace): void {
        this._traces.push(trace);
    }

    public static async save (): Promise<void> {

    }
}
