export enum MidaBrokerOrderDirection {
    BUY = "buy",
    SELL = "sell",
}

export namespace MidaBrokerOrderDirection {
    export function oppositeOf (direction: MidaBrokerOrderDirection): MidaBrokerOrderDirection {
        switch (direction) {
            case MidaBrokerOrderDirection.BUY: {
                return MidaBrokerOrderDirection.SELL;
            }
            case MidaBrokerOrderDirection.SELL: {
                return MidaBrokerOrderDirection.BUY;
            }
        }
    }
}
