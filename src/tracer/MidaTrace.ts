export type MidaTrace = {
    // Represents the time of the trace.
    date: Date;

    // Represents the namespace of the trace.
    namespace: string;

    // Represents the type of trace.
    type: string;

    // Represents a text regarding the trace.
    text?: string;

    // Represents meta regarding the trace.
    meta?: {
        [name: string]: any;
    };
};
