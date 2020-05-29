import { MidaAdvisorEventType } from "#advisor/MidaAdvisorEventType";
import { MidaAdvisorOptions } from "#advisor/MidaAdvisorOptions";
import { AMidaBroker } from "#broker/AMidaBroker";
import { MidaForexPair } from "#forex/MidaForexPair";
import { MidaForexPairExchangeRate } from "#forex/MidaForexPairExchangeRate";
import { MidaForexPairPeriod } from "#forex/MidaForexPairPeriod";
import { MidaPosition } from "#position/MidaPosition";
import { MidaPositionDirectives } from "#position/MidaPositionDirectives";
import { MidaPositionSet } from "#position/MidaPositionSet";
import { MidaPositionStatusType } from "#position/MidaPositionStatusType";
import { AMidaObservable } from "#utilities/observable/AMidaObservable";

export abstract class AMidaAdvisor extends AMidaObservable<MidaAdvisorEventType> {
    // Represents the advisor options.
    private readonly _options: MidaAdvisorOptions;

    // Represents the broker used to operate.
    private readonly _broker: AMidaBroker;

    // Represents the operated forex pair.
    private readonly _forexPair: MidaForexPair;

    // Represents the positions created by the advisor.
    private readonly _positions: MidaPositionSet;

    // Represents the forex pair tick listener UUID.
    private _forexPairTickListenerUUID: string;

    // Indicates if the advisor is operative.
    private _isOperative: boolean;

    protected constructor (options: MidaAdvisorOptions) {
        super();

        this._options = options;
        this._broker = options.broker;
        this._forexPair = options.forexPair;
        this._positions = new MidaPositionSet();
        this._forexPairTickListenerUUID = "";
        this._isOperative = false;
    }

    public get isOperative (): boolean {
        return this._isOperative;
    }

    public get positions (): MidaPosition[] {
        return this._positions.toArray();
    }

    protected get broker (): AMidaBroker {
        return this._broker;
    }

    protected get forexPair (): MidaForexPair {
        return this._forexPair;
    }

    public start (): void {
        if (this._isOperative) {
            return;
        }

        this._isOperative = true;

        this.notifyEvent(MidaAdvisorEventType.START);
    }

    public stop (): void {
        if (!this._isOperative) {
            return;
        }

        this._isOperative = false;

        this.notifyEvent(MidaAdvisorEventType.STOP);
    }

    public async closeAllPositions (): Promise<void> {
        await Promise.all(this.getPositionsByStatus(MidaPositionStatusType.OPEN).map((position: MidaPosition): Promise<void> => position.close()));
    }

    public getPositionsByStatus (status: MidaPositionStatusType): MidaPosition[] {
        return this._positions.toArray().filter((position: MidaPosition): boolean => position.status === status);
    }

    protected onTick (forexPairExchangeRate: MidaForexPairExchangeRate): void {
        // Silence is golden.
    }

    protected async onTickAsync (forexPairExchangeRate: MidaForexPairExchangeRate): Promise<void> {
        // Silence is golden.
    }

    protected async openPosition (positionDirectives: MidaPositionDirectives): Promise<MidaPosition> {
        const position: MidaPosition = await this._broker.openPosition(positionDirectives);

        this._positions.add(position);
        this.notifyEvent(MidaAdvisorEventType.POSITION_OPEN, position);

        return position;
    }

    private _onTick (forexPairExchangeRate: MidaForexPairExchangeRate): void {

    }
}
