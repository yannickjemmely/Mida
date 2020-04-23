import { IMidaBrowserTab } from "#browsers/IMidaBrowserTab";

// Represents a web browser (used by Mida to navigate websites).
export interface IMidaBrowser {
    // Indicates if the browser is open.
    opened: boolean;

    // Used to open the browser.
    open (user?: string): Promise<void>;

    // Used to open a browser tab.
    openTab (): Promise<IMidaBrowserTab>;

    // Used to close all tabs.
    closeTabs (): Promise<void>;

    // Used to close the browser.
    close (): Promise<void>;
}
