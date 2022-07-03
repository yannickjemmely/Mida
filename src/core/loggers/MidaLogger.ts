/*
 * Copyright Reiryoku Technologies and its contributors, www.reiryoku.com, www.mida.org
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

import { MidaLog, } from "#loggers/MidaLog";
import { MidaLogNamespace, } from "#loggers/MidaLogNamespace";

export class MidaLogger {
    readonly #logs: MidaLog[];
    #namespace: MidaLogNamespace;

    public constructor () {
        this.#logs = [];
        this.#namespace = MidaLogNamespace.ALL;
    }

    public get logs (): MidaLog[] {
        return [ ...this.#logs, ];
    }

    public get namespace (): MidaLogNamespace {
        return this.#namespace;
    }

    public set namespace (namespace: MidaLogNamespace) {
        this.#namespace = namespace;
    }

    public log (message: string, namespace: MidaLogNamespace = MidaLogNamespace.INFO): void {
        if (namespace === MidaLogNamespace.ALL || namespace === MidaLogNamespace.OFF) {
            return;
        }

        const log: MidaLog = new MidaLog({
            message,
            namespace,
        });

        this.#logs.push(log);

        if (this.#namespace < log.namespace) {
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

    public debug (message: string): void {
        this.log(message, MidaLogNamespace.DEBUG);
    }

    public info (message: string): void {
        this.log(message, MidaLogNamespace.INFO);
    }

    public warn (message: string): void {
        this.log(message, MidaLogNamespace.WARN);
    }

    public error (message: string): void {
        this.log(message, MidaLogNamespace.ERROR);
    }

    public fatal (message: string): void {
        this.log(message, MidaLogNamespace.FATAL);
    }
}

export const defaultLogger: MidaLogger = new MidaLogger();
export const log = (message: string): void => defaultLogger.log(message);
export const debug = (message: string): void => defaultLogger.debug(message);
export const info = (message: string): void => defaultLogger.info(message);
export const warn = (message: string): void => defaultLogger.warn(message);
export const error = (message: string): void => defaultLogger.error(message);
export const fatal = (message: string): void => defaultLogger.fatal(message);
