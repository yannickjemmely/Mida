// Represents an HTTP response.
export type MidaHttpResponse = {
    // Represents the response status.
    status: number;

    // Represents the response headers.
    headers: {
        [name: string]: string;
    };

    // Represents the response body.
    body: string;
};
