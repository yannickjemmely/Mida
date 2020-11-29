import { MidaBrowserTab } from "#browsers/MidaBrowserTab";

// Represents a web browser.
export abstract class MidaBrowser {
    // Indicates if the browser is open.
    public abstract get isOpen (): boolean;

    // Used to open the browser.
    public abstract open (...parameters: any[]): Promise<void>;

    // Used to open a browser tab.
    public abstract openTab (...parameters: any[]): Promise<MidaBrowserTab>;

    // Used to close all tabs.
    public abstract closeTabs (): Promise<void>;

    // Used to close the browser.
    public abstract close (): Promise<void>;
}
