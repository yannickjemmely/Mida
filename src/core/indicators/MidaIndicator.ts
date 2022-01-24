import { MidaError } from "#errors/MidaError";
import { MidaIndicatorFormat } from "#indicators/MidaIndicatorFormat";
import { MidaIndicatorParameters } from "#indicators/MidaIndicatorParameters";
import { GenericObject } from "#utilities/GenericObject";

export abstract class MidaIndicator {
    readonly #name: string;

    protected constructor ({ name, }: MidaIndicatorParameters) {
        this.#name = name;
    }

    public get name (): string {
        return this.#name;
    }

    public abstract calculate (input: MidaIndicatorFormat): Promise<MidaIndicatorFormat>;

    public abstract next (input: MidaIndicatorFormat): Promise<MidaIndicatorFormat>;

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

    public static create (name: string, parameters?: GenericObject): MidaIndicator {
        const indicatorConstructor: any | undefined = MidaIndicator.#installedIndicators.get(name);

        if (!indicatorConstructor) {
            // @ts-ignore
            throw new MidaError();
        }

        return new indicatorConstructor();
    }
}
