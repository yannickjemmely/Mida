export enum MidaBrokerErrorType {
    BROKER_ALREADY_INSTALLED = "broker-already-installed",
    BROKER_NOT_INSTALLED = "broker-not-installed",

    INVALID_LOGIN_CREDENTIALS = "invalid-login-credentials",
    INVALID_SYMBOL = "invalid-symbol",
    INVALID_LOTS = "invalid-lots",
    INVALID_STOP_LOSS = "invalid-stop-loss",
    INVALID_TAKE_PROFIT = "invalid-take-profit",
    INVALID_TIMEFRAME = "invalid-timeframe",

    MARKET_CLOSED = "market-closed",

    NOT_ENOUGH_MONEY = "not-enough-money",

    ORDER_NOT_FOUND = "order-not-found",
    ORDER_IS_NOT_PENDING = "order-is-not-pending",
    ORDER_IS_NOT_OPEN = "order-is-not-open",
}
