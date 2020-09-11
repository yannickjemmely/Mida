import { MidaBrokerAccountType } from "#broker/MidaBrokerAccountType";
import { MidaBrokerEventType } from "#broker/MidaBrokerEventType";
import { MidaCurrency } from "#currency/MidaCurrency";
import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaForexPairExchangeRate } from "#forex/MidaForexPairExchangeRate";
import { MidaForexPairPeriod } from "#forex/MidaForexPairPeriod";
import { MidaForexPairPeriodType } from "#forex/MidaForexPairPeriodType";
import { MidaPosition } from "#position/MidaPosition";
import { MidaPositionDirectives } from "#position/MidaPositionDirectives";
import { MidaPositionStatusType } from "#position/MidaPositionStatusType";
import { AMidaObservable } from "#utilities/observable/AMidaObservable";

export abstract class AMidaBroker extends AMidaObservable<MidaBrokerEventType> {
    protected constructor () {
        super();
    }

    // Indicates if an account is logged in.
    public abstract get isLoggedIn (): boolean;

    // Represents the ID of the account logged in.
    public abstract get accountId (): string;

    // Represents the type of the actual account.
    public abstract get accountType (): MidaBrokerAccountType;

    // Represents the name of the broker.
    public abstract get name (): string;

    // Used to login.
    public abstract login (accountDescriptor?: any): Promise<void>;

    // Used to open a position.
    public abstract openPosition (directives: MidaPositionDirectives): Promise<MidaPosition>;

    // Used to get a position by its uuid.
    public abstract getPositionByUuid (uuid: string): Promise<MidaPosition | null>;

    // Used to get positions by their status.
    public abstract getPositionsByStatus (status: MidaPositionStatusType): Promise<MidaPosition[]>;

    // Used to close a position by its UUID.
    public abstract closePositionByUUID (UUID: string): Promise<void>;

    // Used to get the actual balance.
    public abstract getBalance (): Promise<number>;

    // Used to reset the balance (only for demo accounts).
    public abstract resetBalance (): Promise<void>;

    // Used to get the actual equity.
    public abstract getEquity (): Promise<number>;

    // Used to get the actual free margin.
    public abstract getFreeMargin (): Promise<number>;

    // Used to get the account currency.
    public abstract getCurrency (): Promise<MidaCurrency>;

    // Used to listen the ticks of a forex pair.
    public abstract addForexPairTickListener (forexPair: MidaForexPair, listener: (exchangeRate: MidaForexPairExchangeRate) => void): string;

    // Used to unlisten the ticks of a forex pair.
    public abstract removeForexPairTickListener (UUID: string): boolean;

    // Used to listen the periods of a forex pair.
    public abstract addForexPairPeriodListener (forexPair: MidaForexPair, listener: (period: MidaForexPairPeriod) => void): string;

    // Used to unlisten the periods of a forex pair.
    public abstract removeForexPairPeriodListener (UUID: string): boolean;

    // Used to get the actual exchange rate of a forex pair.
    public abstract getForexPairExchangeRate (forexPair: MidaForexPair): Promise<MidaForexPairExchangeRate>;

    // Used to get the periods of a forex pair.
    // The returned periods must be from oldest to newest: periods[0] = oldest period.
    public abstract getForexPairPeriods (forexPair: MidaForexPair, periodsType: MidaForexPairPeriodType): Promise<MidaForexPairPeriod[]>;

    // Used to logout.
    public abstract logout (): Promise<void>;
}
