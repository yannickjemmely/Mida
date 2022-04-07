/*
 * Copyright Reiryoku Technologies and its contributors, https://www.reiryoku.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
*/

import { MidaLog } from "#logs/MidaLog";
import { MidaLogNamespace } from "#logs/MidaLogNamespace";

export class MidaLogger {
    private constructor () {
        // Silence is golden
    }

    /* *** *** *** Reiryoku Technologies *** *** *** */

    static readonly #logs: MidaLog[] = [];
    static #namespace: MidaLogNamespace = MidaLogNamespace.ALL;

    public static get logs (): MidaLog[] {
        return [ ...MidaLogger.#logs, ];
    }

    public static get namespace (): MidaLogNamespace {
        return MidaLogger.#namespace;
    }

    public static set namespace (namespace: MidaLogNamespace) {
        MidaLogger.#namespace = namespace;
    }

    public static log (message: string, namespace?: MidaLogNamespace): void {
        if (namespace === MidaLogNamespace.ALL || namespace === MidaLogNamespace.OFF) {
            return;
        }

        const log: MidaLog = new MidaLog({
            message,
            namespace,
        });

        MidaLogger.#logs.push(log);

        if (MidaLogger.#namespace < log.namespace) {
            return;
        }

        let logMethodName: "debug" | "info" | "warn" | "error";

        switch (log.namespace) {
            case MidaLogNamespace.DEBUG: {
                logMethodName = "debug";

                break;
            }
            case MidaLogNamespace.INFO: {
                logMethodName = "info";

                break;
            }
            case MidaLogNamespace.WARN: {
                logMethodName = "warn";

                break;
            }
            case MidaLogNamespace.ERROR:
            case MidaLogNamespace.FATAL: {
                logMethodName = "error";

                break;
            }
            default: {
                throw new Error();
            }
        }

        console[logMethodName](log.toString());
    }

    public static debug (message: string): void {
        MidaLogger.log(message, MidaLogNamespace.DEBUG);
    }

    public static info (message: string): void {
        MidaLogger.log(message, MidaLogNamespace.INFO);
    }

    public static warn (message: string): void {
        MidaLogger.log(message, MidaLogNamespace.WARN);
    }

    public static error (message: string): void {
        MidaLogger.log(message, MidaLogNamespace.ERROR);
    }

    public static fatal (message: string): void {
        MidaLogger.log(message, MidaLogNamespace.FATAL);
    }
}

export const debug = MidaLogger.debug;
export const info = MidaLogger.info;
export const warn = MidaLogger.warn;
export const error = MidaLogger.error;
export const fatal = MidaLogger.fatal;
