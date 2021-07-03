export enum MidaBrokerPositionDirection {
    LONG = "long",
    SHORT = "short",
}

export namespace MidaBrokerPositionDirection {
    export function oppositeOf (direction: MidaBrokerPositionDirection): MidaBrokerPositionDirection {
        switch (direction) {
            case MidaBrokerPositionDirection.LONG: {
                return MidaBrokerPositionDirection.SHORT;
            }

            case MidaBrokerPositionDirection.SHORT: {
                return MidaBrokerPositionDirection.LONG;
            }
        }
    }
}
