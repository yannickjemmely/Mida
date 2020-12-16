import Timeout = NodeJS.Timeout;

export abstract class MidaExtern {
    protected constructor () {
        // Silence is golden.
    }

    protected _assertPromiseDuration (promise: Promise<any>, timeout: number): Promise<any> {
        return new Promise((resolve: any, reject: any): any => {
            setTimeout((): any => reject(), timeout);
        });
    }
}
