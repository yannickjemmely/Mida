export namespace MidaTimeframe {
    const commonTimeframes: Map<string, number> = new Map([
        [ "S", 1, ],
        [ "M", 60, ],
        [ "H", 3600, ],
        [ "D", 86400, ],
        [ "W", 604800, ],
        [ "MO", 2592000, ],
        [ "Y", 31536000, ],
    ]);

    export function parseTimeframe (timeframe: string): number | undefined {
        const orderedTimeframes: string[] = [ ...commonTimeframes.keys(), ].sort((a: string, b: string) => a.length - b.length);
        let quantity: number = NaN;

        for (const commonTimeframe of orderedTimeframes) {
            if (timeframe.startsWith(commonTimeframe)) {
                // @ts-ignore
                quantity = Number.parseInt(timeframe.substr(commonTimeframe.length), 10) * commonTimeframes.get(commonTimeframe);

                break;
            }
        }

        if (!Number.isFinite(quantity) || quantity < 0) {
            return undefined;
        }

        return quantity;
    }
}

export enum MidaTimeframe {
    /** 1 second. */
    S1 = 1,
    /** 1 minute. */
    M1 = 60,
    /** 5 minutes. */
    M5 = 300,
    /** 15 minutes. */
    M15 = 900,
    /** 30 minutes. */
    M30 = 1800,
    /** 1 hour. */
    H1 = 3600,
    /** 4 hours. */
    H4 = 14400,
    /** 1 day. */
    D1 = 86400,
    /** 1 week. */
    W1 = 604800,
    /** 1 month. */
    MO1 = 2592000,
    /** 1 year. */
    Y1 = 31536000,
}
