export enum MidaBrokerOrderRejection {
    MARKET_CLOSED = "market-closed",
    SYMBOL_NOT_FOUND = "symbol-not-found",
    SYMBOL_DISABLED = "symbol-disabled",
    POSITION_NOT_FOUND = "position-not-found",
    NOT_ENOUGH_MONEY = "not-enough-money",
    NO_LIQUIDITY = "no-liquidity",
    INVALID_VOLUME = "invalid-volume",
    INVALID_TAKE_PROFIT = "invalid-take-profit",
    INVALID_STOP_LOSS = "invalid-stop-loss",
}
