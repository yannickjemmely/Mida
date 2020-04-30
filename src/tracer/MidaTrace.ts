export type MidaTrace = {
    date: Date;

    namespace: string;

    type: string;

    text?: string;

    meta?: {
        [name: string]: any;
    };
};
