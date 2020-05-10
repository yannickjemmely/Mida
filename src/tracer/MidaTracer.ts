import * as FileSystem from "fs";
import { MidaTrace } from "#tracer/MidaTrace";

export class MidaTracer {
    private static _traces: MidaTrace[] = [];

    private constructor () {
        // Silence is golden.
    }

    public static trace (trace: MidaTrace): void {
        this._traces.push(trace);
    }

    public static save (): void {
        const files: any = {};

        for (const trace of this._traces) {
            const temporaryTraces: any = files[trace.date.toLocaleDateString("en-GB")] || {};
            const namespaceTraces: MidaTrace[] = temporaryTraces[trace.namespace] || [];

            namespaceTraces.push(trace);
        }
    }
}
