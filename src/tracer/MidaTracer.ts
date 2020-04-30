export class MidaTracer {
    private static _traces: {
        [namespace: string]: string[];
    } | null = null;

    private constructor () {
        // Silence is golden.
    }

    public static trace (namespace: string, text: string): void {
        // Silence is golden.
    }
}
