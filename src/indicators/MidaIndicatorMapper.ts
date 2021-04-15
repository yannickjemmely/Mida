import { MidaIndicator } from "#indicators/MidaIndicator";

export class MidaIndicatorMapper {
    private static readonly _indicators: Map<string, typeof MidaIndicator> = new Map();

    private constructor () {
        // Silence is golden.
    }

    public static define (name: string, reference: typeof MidaIndicator): void {
        MidaIndicatorMapper._indicators.set(name, reference);
    }
}
