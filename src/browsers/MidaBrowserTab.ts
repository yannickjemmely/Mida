import { MidaBrowser } from "#browsers/MidaBrowser";
import { MidaHttpResponse } from "#utilities/http/MidaHttpResponse";

// Represents a browser tab (used to load and manipulate webpages).
export abstract class MidaBrowserTab {
    // Represents the browser that created the window.
    public abstract get browser (): MidaBrowser;

    // Used to set the user agent of the tab.
    public abstract setUserAgent (userAgent: string): Promise<void>;

    // Used to request and load a webpage.
    public abstract goto (uri: string): Promise<MidaHttpResponse>;

    // Used to evaluate JavaScript code in the current document.
    public abstract evaluate (text: string): Promise<any>;

    // Used to expose a function to the current document.
    public abstract exposeProcedure (name: string, procedure: (...parameters: any[]) => any): Promise<void>;

    // Used to focus an element in the current document.
    public abstract focus (selector: string): Promise<boolean>;

    // Used to type in a input element in the current document.
    public abstract type (selector: string, text: string): Promise<boolean>;

    // Used to click an element in the current document.
    public abstract click (selector: string, count?: number): Promise<boolean>;

    // Used to wait until a given selector is matched.
    public abstract waitForSelector (selector: string): Promise<void>;

    // Used to close the tab.
    public abstract close (): Promise<void>;
}
