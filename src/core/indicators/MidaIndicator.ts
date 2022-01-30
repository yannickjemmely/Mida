import { MidaIndicatorIo } from "#indicators/MidaIndicatorIo";
import { MidaIndicatorParameters } from "#indicators/MidaIndicatorParameters";
import { GenericObject } from "#utilities/GenericObject";

export abstract class MidaIndicator {
    readonly #name: string;
    readonly #inputs: MidaIndicatorIo[];
    readonly #value: MidaIndicatorIo[];

    protected constructor ({ name, }: MidaIndicatorParameters) {
        this.#name = name;
        this.#inputs = [];
        this.#value = [];
    }

    public get name (): string {
        return this.#name;
    }

    public get inputs (): MidaIndicatorIo[] {
        return this.#inputs;
    }

    public get value (): MidaIndicatorIo[] {
        return this.#value;
    }

    public abstract next (input: MidaIndicatorIo[]): Promise<MidaIndicatorIo[]>;

    /* *** *** *** Reiryoku Technologies *** *** *** */

    static readonly #installedIndicators: Map<string, typeof MidaIndicator> = new Map();

    public static get installedIndicators (): string[] {
        return [ ...MidaIndicator.#installedIndicators.keys(), ];
    }

    public static add (name: string, indicatorConstructor: typeof MidaIndicator): void {
        if (MidaIndicator.#installedIndicators.has(name)) {
            return;
        }

        MidaIndicator.#installedIndicators.set(name, indicatorConstructor);
    }

    public static create (name: string, parameters: GenericObject = {}): MidaIndicator {
        const indicatorConstructor: any | undefined = MidaIndicator.#installedIndicators.get(name);

        if (!indicatorConstructor) {
            throw new Error();
        }

        return new indicatorConstructor(parameters);
    }

    public static async calculate (name: string, input: MidaIndicatorIo[]): Promise<MidaIndicatorIo> {
        const indicator: MidaIndicator = MidaIndicator.create(name);

        return indicator.next(input);
    }
}
