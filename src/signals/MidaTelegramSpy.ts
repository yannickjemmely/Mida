import { MidaSignal } from "#signals/MidaSignal";

// Represents a Telegram signals channel spy.
export type MidaTelegramSpy = {
    // Represents the name of the channel.
    name?: string;

    // Represents the channel id.
    channelID: string;

    // Used to parse a message from the channel and get its signal.
    parse (text: string): MidaSignal | null;
};
