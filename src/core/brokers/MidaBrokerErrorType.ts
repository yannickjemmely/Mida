export enum MidaBrokerErrorType {
    /** Thrown while installing a broker that already exists. */
    BROKER_ALREADY_INSTALLED = "broker-already-installed",
    /** Thrown while trying to login into a broker that is not installed. */
    BROKER_NOT_INSTALLED = "broker-not-installed",

    INVALID_LOGIN_CREDENTIALS = "invalid-login-credentials",
    INVALID_ORDER_DIRECTIVES = "invalid-order-directives",
    INVALID_SYMBOL = "invalid-symbol",
    INVALID_LOTS = "invalid-lots",
    INVALID_TIMEFRAME = "invalid-timeframe",

    /** Thrown while trying to operate in a closed market. */
    MARKET_CLOSED = "market-closed",

    /** Thrown when trying to make trades that require more money than is available. */
    NOT_ENOUGH_MONEY = "not-enough-money",

    ORDER_NOT_FOUND = "order-not-found",
    ORDER_IS_PENDING = "order-is-pending",
    ORDER_IS_CLOSED = "order-is-closed",
    ORDER_IS_NOT_PENDING = "order-is-not-pending",
    ORDER_IS_NOT_OPEN = "order-is-not-open",
    ORDER_IS_ALREADY_CLOSED = "order-is-already-closed",
    ORDER_IS_ALREADY_CANCELED = "order-is-already-canceled",
}
