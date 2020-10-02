import { IMidaBrowserTab } from "#browser/IMidaBrowserTab";

// Represents a web browser.
export interface IMidaBrowser {
    // Indicates if the browser is open.
    readonly isOpen: boolean;

    // Used to open the browser.
    open (id?: string): Promise<void>;

    // Used to open a browser tab.
    openTab (): Promise<IMidaBrowserTab>;

    // Used to close all tabs.
    closeTabs (): Promise<void>;

    // Used to close the browser.
    close (): Promise<void>;
}
