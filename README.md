<br>
<p align="center"> 
    <img src="images/logo.svg" alt="Mida" width="352px">
</p>
<br>
<p align="center">
    A JavaScript framework to easily operate in global financial markets.
</p>
<br>

Designed to:
- Trade financial assets such as stocks, crypto, forex or commodities;
- Operate with any broker/exchange using only JavaScript/TypeScript;
- Automate and backtest trading/investment strategies through expert advisors;
- Analyze markets and prices with indicators and analysis interfaces.

Mida is free and open source, join the [Discord community](https://discord.gg/cKyWTUsr3q).

## Usage
### Broker account login
How to login into a cTrader broker account.
```javascript
const { Mida, MidaBroker } = require("@reiryoku/mida");

// Use the Mida cTrader plugin
Mida.use(require("@reiryoku/mida-ctrader"));

// Login into any cTrader broker account
const myAccount = await MidaBroker.login("cTrader", {
    clientId: "",
    clientSecret: "",
    accessToken: "",
    cTraderBrokerAccountId: "",
});
```

To get a `clientId`, `clientSecret` and `accessToken` you have to create an account on
[cTrader Open API](https://connect.spotware.com), the API usage is free.

### Broker orders and positions
How top open a long position for Bitcoin against USD.
```javascript
const { MidaBrokerOrderDirection } = require("@reiryoku/mida");

const myOrder = await myAccount.openPosition({
    symbol: "BTCUSD",
    direction: MidaBrokerOrderDirection.BUY,
    volume: 1,
});

console.log(myOrder.id);
console.log(myOrder.openPrice);
```

How to open a short position for EUR against USD.
```javascript
const { MidaBrokerOrderDirection } = require("@reiryoku/mida");

const myOrder = await myAccount.placeOrder({
    symbol: "EURUSD",
    direction: MidaBrokerOrderDirection.SELL,
    volume: 0.1,
});

console.log(myOrder.id);
console.log(myOrder.openPrice);
```

How to open a short position for Apple stocks with errors handler.
```javascript
const {
    MidaBrokerOrderDirection,
    MidaBrokerErrorType,
} = require("@reiryoku/mida");

const myOrder = await myAccount.placeOrder({
    symbol: "#AAPL",
    direction: MidaBrokerOrderDirection.SELL,
    volume: 1,
});

if (myOrder.isRejected) {
    switch (myOrder.rejectionType) {
        case MidaBrokerOrderRejectionType.MARKET_CLOSED: {
            console.log("#AAPL market is closed!");

            break;
        }
        case MidaBrokerOrderRejectionType.NOT_ENOUGH_MONEY: {
            console.log("You don't have enough money in your account!");

            break;
        }
        case MidaBrokerOrderRejectionType.INVALID_SYMBOL: {
            console.log("Your broker account doesn't support trading Apple stocks!");

            break;
        }
    }
}
```

<details><summary>More examples</summary>

In case you don't want to handle errors you can use `tryPlaceOrder` which returns `undefined` if the
order has not been placed for any reason.
```javascript
const myOrder = await myAccount.tryPlaceOrder({
    symbol: "#AAPL",
    type: MidaBrokerOrderDirection.SELL,
    lots: 1,
});

if (!myOrder) {
    console.log("Order not placed.");
}
```

In addition, `canPlaceOrder` or `getPlaceOrderObstacles` can be used to know if an order can be placed without errors.
Due to the high volatility of financial markets, these methods can't guarantee that the order is going to be placed without errors being thrown.

```javascript
const orderDirectives = {
    symbol: "#AAPL",
    type: MidaBrokerOrderDirection.SELL,
    lots: 1,
};

const canPlaceOrder = await myAccount.canPlaceOrder(orderDirectives);
// => true | false
const placeOrderObstacles = await myAccount.getPlaceOrderObstacles(orderDirectives);
// => MidaBrokerErrorType[]

if (placeOrderObstacles.includes(MidaBrokerErrorType.MARKET_CLOSED)) {
    console.log("#AAPL market is closed!");
}

if (placeOrderObstacles.includes(MidaBrokerErrorType.NOT_ENOUGH_MONEY)) {
    console.log("You don't have enough money in your account!");
}
```

How to open a long position for GBP against USD with stop loss and take profit.
```javascript
const { MidaBrokerOrderDirection } = require("@reiryoku/mida");

const symbol = "GBPUSD";
const lastBid = await myAccount.getSymbolBid(symbol);
const myOrder = await myAccount.placeOrder({
    symbol,
    type: MidaBrokerOrderDirection.BUY,
    volume: 0.1,
    protection: {
        stopLoss: lastBid - 0.0010, // <= SL 10 pips
        takeProfit: lastBid + 0.0030, // <= TP 30 pips
    },
});
```

</details>

### Symbols
How to retrieve all symbols available for your broker account.
```javascript
const symbols = await myAccount.getSymbols(); // => string[]

console.log(symbols);
```

How to retrieve a symbol.
```javascript
const symbol = await myAccount.getSymbol("#AAPL"); // => MidaSymbol | undefined

if (!symbol) {
    console.log("Apple stocks are not available for this account!");
}
else {
    console.log(symbol.digits);
    console.log(symbol.leverage);
    console.log(await symbol.isMarketOpen());
}
```

How to get the price of a symbol.
```javascript
const symbol = await myAccount.getSymbol("BTCUSD");
const price = await symbol.getBid();

console.log(`Bitcoin price is ${price} dollars.`);

// or

console.log(await myAccount.getSymbolBid("BTCUSD"));
```

How to listen the ticks of a symbol.
```javascript
const symbol = await myAccount.getSymbol("#GME");

await symbol.watch();

symbol.on("tick", (event) => {
    const tick = event.descriptor.tick;
    
    console.log(`GameStop share price is now ${tick.bid} dollars`);
});

// or

await myAccount.watchSymbol("#GME");

myAccount.on("tick", (event) => {
    const tick = event.descriptor.tick;
    
    if (tick.symbol === "#GME") {
        console.log(`GameStop share price is now ${tick.bid} dollars`);
    }
});
```

### Expert advisors
How to create an expert advisor.
```javascript
const {
    MidaExpertAdvisor,
    MidaTimeframeType,
} = require("@reiryoku/mida");

class MyExpertAdvisor extends MidaExpertAdvisor {
    constructor ({ brokerAccount, }) {
        super({ brokerAccount, });
    }
    
    async configure () {
        this.watchSymbol("EURUSD");
    }

    async onTick (tick) {
        // Implement your strategy.
    }
    
    async onPeriod (period) {
        if (period.timeframe === MidaTimeframeType.H1) {
            console.log(`New H1 candlestick with open price => ${period.open}`);
        }
    }
}
```

How to execute an expert advisor.
```javascript
const { MidaBroker } = require("@reiryoku/mida");
const { MyExpertAdvisor } = require("./my-expert-advisor"); 

const myAccount = await MidaBroker.login(/* ... */);
const myAdvisor = new MyExpertAdvisor({ brokerAccount: myAccount, });

myAdvisor.on("order-open", (event) => console.log(`New order opened with ticket => ${event.descriptor.ticket}`));
await myAdvisor.start({ stopAfter: 60000 * 60, }); // The EA will stop after one hour.
```

### Market analysis and indicators
Examples of technical market analysis.

#### Candlesticks
How to get the candlesticks of a symbol (candlesticks and bars are generally referred as periods).
```javascript
const { MidaTimeframeType } = require("@reiryoku/mida");

const periods = await myAccount.getSymbolPeriods("EURUSD", MidaTimeframeType.M30);
const lastPeriod = periods[periods.length - 1];

console.log("Last candlestick start time: " + lastPeriod.startTime);
console.log("Last candlestick OHLC: " + lastPeriod.ohlc);
console.log("Last candlestick close price: " + lastPeriod.close);
```

#### Relative Strength Index
How to calculate the RSI indicator for Bitcoin on H1 chart.
```javascript
const {
    MidaIndicator,
    MidaTimeframeType,
} = require("@reiryoku/mida");

const periods = await myAccount.getSymbolPeriods("BTCUSD", MidaTimeframeType.H1);
const rsi = await MidaIndicator.calc("RSI", {
    prices: periods.map((period) => period.close),
    length: 14,
});

console.log("Actual RSI => " + rsi[rsi.length - 1]);
```

#### Bollinger Bands
How to calculate the Bollinger Bands indicator for Ethereum on M5 chart.
```javascript
const {
    MidaIndicator,
    MidaTimeframeType,
} = require("@reiryoku/mida");

const periods = await myAccount.getSymbolPeriods("ETHUSD", MidaTimeframeType.M5);
const bollingerBands = await MidaIndicator.calc("BollingerBands", {
    prices: periods.map((period) => period.close),
    length: 20,
});
```

### Practice and backtest
Playground is a local broker created for paper trading and backtesting.

```javascript
const {
    Mida,
    MidaBroker,
} = require("@reiryoku/mida");

// Use the Mida Playground plugin.
Mida.use(require("@reiryoku/mida-playground"));

const myAccount = await MidaBroker.login("Playground", {
    id: "test", // The account id.
    localDate: new Date("2020-04-23"), // The broker local date.
    currency: "USD", // The account currency.
    balance: 10000, // The account initial balance.
    negativeBalanceProtection: true,
});

// Used to listen any market ticks.
myAccount.on("tick", (event) => {
    const tick = event.descriptor.tick;
    
    console.log(`New tick for ${tick.symbol} => ${tick.bid} | ${tick.ask}`);
});

// Used to elapse a given amount of time in the local date, this will trigger ticks.
await myAccount.elapseTime(60 * 10); // 60 seconds * 10 = 10 minutes.

console.log(myAccount.localDate); // The local date is now 2020-04-23 00:10:00.
```

#### Backtest expert advisors
If you have created an expert advisor, you can easily backtest it by just assigning
the playground broker to it.

```javascript
import { MyExpertAdvisor } from "./my-expert-advisor";

const myAdvisor = new MyExpertAdvisor({ brokerAccount: myAccount, });

await myAdvisor.start();
await myAccount.elapseTime(60 * 60 * 24); // Elapse 1 hour, this will trigger ticks and candles.

console.log(myAdvisor.orders); // The orders created by the EA in one hour.
```

## Disclaimer
Operating in CFDs/Forex is highly speculative and carries a high level of risk.
It's possible to lose all your capital. These products may not be suitable for everyone,
you should ensure that you understand the risks involved. Furthermore, Mida is not responsible
for commissions or other taxes applied to your operations, they depend on your broker. Mida and its authors
are also not responsible for any technical inconvenience that may lead to money loss, for example a stop loss not being set.

## Contributors
The author and maintainer of the project is [Vasile Pește](https://github.com/Vasile-Peste) (vasile.peste@protonmail.ch).
