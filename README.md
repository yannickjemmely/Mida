<br><br>
<p align="center"> 
    <img src="images/logo.svg" alt="Mida" width="352px">
</p>
<br>
<p align="center">
    <b>A JavaScript framework for trading in global financial markets</b>
</p>
<br>
<p align="center">
    <a href="https://www.npmjs.com/package/@reiryoku/mida">
        <img src="https://img.shields.io/npm/v/@reiryoku/mida" alt="">
    </a>
    <a href="./LICENSE">
        <img src="https://img.shields.io/npm/l/@reiryoku/mida" alt="">
    </a>
    <a href="https://discord.gg/cKyWTUsr3q">
        <img src="https://img.shields.io/discord/780532638846287904?label=community" alt="">
    </a>
</p>
<br><br>

## Introduction
Mida is a JavaScript framework for trading financial assets such as stocks, crypto, forex or commodities.
It is designed to provide a solid and scalable environment for creating trading bots, indicators,
market analysis tools or just trading applications depending on use cases.

Join the community on [Discord](https://discord.gg/cKyWTUsr3q) and [Telegram](https://t.me/joinmida)
to get help you with your first steps.
<br>

## Table of contents
* [Ecosystem](#ecosystem)
* [Installation](#installation)
* [Usage](#usage)
    * [Account login](#account-login)
    * [Balance, equity and margin](#balance-equity-and-margin)
    * [Orders, deals and positions](#orders-deals-and-positions)
    * [Symbols and assets](#symbols-and-assets)
    * [Ticks and candlesticks](#ticks-and-candlesticks)
    * [Trading bots (expert advisors)](#trading-bots-expert-advisors)
    * [Technical indicators](#technical-indicators)
* [License and disclaimer](#license-and-disclaimer)
* [Contributors](#contributors)

## Ecosystem
| Project                  | Status                        | Description                     |
| -----------              | -----------                   | -----------                     |
| [Mida cTrader](https://github.com/Reiryoku-Technologies/Mida-cTrader)     | [![Image](https://img.shields.io/npm/v/@reiryoku/mida-ctrader)](https://www.npmjs.com/package/@reiryoku/mida-ctrader)        | A plugin for using cTrader accounts                |
| [Mida Tulipan](https://github.com/Reiryoku-Technologies/Mida-Tulipan)     | [![Image](https://img.shields.io/npm/v/@reiryoku/mida-tulipan)](https://www.npmjs.com/package/@reiryoku/mida-tulipan)        | A plugin providing technical analysis indicators   |
| [Apollo](https://github.com/Reiryoku-Technologies/Apollo)                 | [![Image](https://img.shields.io/npm/v/@reiryoku/apollo)](https://www.npmjs.com/package/@reiryoku/apollo)                    | A library for getting real-time economic data      |

## Installation
```console
npm i @reiryoku/mida @reiryoku/mida-ctrader
```

## Usage
### Account login
How to login into a cTrader broker account.
```javascript
const { Mida, MidaBroker, } = require("@reiryoku/mida");

// Use the Mida cTrader plugin
Mida.use(require("@reiryoku/mida-ctrader"));

// Login into any cTrader account
const myAccount = await MidaBroker.login("cTrader", {
    clientId: "",
    clientSecret: "",
    accessToken: "",
    cTraderBrokerAccountId: "",
});
```

To get a `clientId`, `clientSecret` and `accessToken` you have to create an account on
[cTrader Open API](https://connect.spotware.com).

### Balance, equity and margin
How to get the account balance, equity and margin.
```javascript
const { MidaBrokerOrderDirection, } = require("@reiryoku/mida");

console.log(await myAccount.getBalance());
console.log(await myAccount.getEquity());
console.log(await myAccount.getFreeMargin());
console.log(await myAccount.getUsedMargin());
```

### Orders, deals and positions
How top open a long position for Bitcoin against USD.
```javascript
const { MidaBrokerOrderDirection, } = require("@reiryoku/mida");

const myOrder = await myAccount.placeOrder({
    symbol: "BTCUSD",
    direction: MidaBrokerOrderDirection.BUY,
    volume: 1,
});

console.log(myOrder.id);
console.log(myOrder.executionPrice);
console.log(myOrder.position);
console.log(myOrder.deals);
```

How to open a short position for EUR against USD.
```javascript
const { MidaBrokerOrderDirection, } = require("@reiryoku/mida");

const myOrder = await myAccount.placeOrder({
    symbol: "EURUSD",
    direction: MidaBrokerOrderDirection.SELL,
    volume: 0.1,
});

console.log(myOrder.id);
console.log(myOrder.executionPrice);
console.log(myOrder.position);
console.log(myOrder.deals);
```

How to open a short position for Apple stocks with error handler.
```javascript
const {
    MidaBrokerOrderDirection,
    MidaBrokerOrderRejectionType,
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
            console.log("Your account doesn't support trading Apple stocks!");

            break;
        }
    }
}
```

How to open a long position for GBP against USD with stop loss and take profit.
```javascript
const { MidaBrokerOrderDirection, } = require("@reiryoku/mida");

const symbol = "GBPUSD";
const lastBid = await myAccount.getSymbolBid(symbol);
const myOrder = await myAccount.placeOrder({
    symbol,
    direction: MidaBrokerOrderDirection.BUY,
    volume: 0.1,
    protection: {
        stopLoss: lastBid - 0.0010, // <= SL 10 pips
        takeProfit: lastBid + 0.0030, // <= TP 30 pips
    },
});
```

How to open volume for an open position.
```javascript
const {
    MidaBrokerOrderDirection,
    MidaBrokerPositionDirection,
} = require("@reiryoku/mida");

const myPosition = await myAccount.getPositionById("...");

await myPosition.addVolume(1);
// or
await myAccount.placeOrder({
    positionId: myPosition.id,
    direction: myPosition.direction === MidaBrokerPositionDirection.LONG ? MidaBrokerOrderDirection.BUY : MidaBrokerOrderDirection.SELL,
    volume: 1,
});
```

How to close volume for an open position.
```javascript
const {
    MidaBrokerOrderDirection,
    MidaBrokerPositionDirection,
} = require("@reiryoku/mida");

const myPosition = await myAccount.getPositionById("...");

await myPosition.subtractVolume(1);
// or
await myAccount.placeOrder({
    positionId: myPosition.id,
    direction: myPosition.direction === MidaBrokerPositionDirection.LONG ? MidaBrokerOrderDirection.SELL : MidaBrokerOrderDirection.BUY,
    volume: 1,
});
```

How to close an open position.
```javascript
const {
    MidaBrokerOrderDirection,
    MidaBrokerPositionDirection,
} = require("@reiryoku/mida");

const myPosition = await myAccount.getPositionById("...");

await myPosition.close();
// or
await myPosition.subtractVolume(myPosition.volume);
// or
await myAccount.placeOrder({
    positionId: myPosition.id,
    direction: myPosition.direction === MidaBrokerPositionDirection.LONG ? MidaBrokerOrderDirection.SELL : MidaBrokerOrderDirection.BUY,
    volume: myPosition.volume,
});
```

How to retrieve all open positions and pending orders.
```javascript
console.log(await myAccount.getOpenPositions());
console.log(await myAccount.getPendingOrders());
```

How to set take profit and stop loss for a position.
```javascript
const myPosition = await myAccount.getPositionById("...");

await myPosition.changeProtection({
    takeProfit: 200,
    stopLoss: 100,
});
```

### Symbols and assets
How to retrieve all symbols available for your broker account.
```javascript
const symbols = await myAccount.getSymbols();

console.log(symbols);
```

How to retrieve a symbol.
```javascript
const symbol = await myAccount.getSymbol("#AAPL");

if (!symbol) {
    console.log("Apple stocks are not available for this account!");
}
else {
    console.log(symbol.digits);
    console.log(symbol.leverage);
    console.log(symbol.baseAsset);
    console.log(symbol.quoteAsset);
    console.log(await symbol.isMarketOpen());
}
```

How to get the price of a symbol.
```javascript
const symbol = await myAccount.getSymbol("BTCUSD");
const price = await symbol.getBid();

console.log(`Bitcoin price is ${price} US dollars`);

// or

console.log(await myAccount.getSymbolBid("BTCUSD"));
```

### Ticks and candlesticks
How to listen the ticks of a symbol.
```javascript
const { MidaMarketWatcher, } = require("@reiryoku/mida");

const marketWatcher = new MidaMarketWatcher({ brokerAccount: myAccount, });

await marketWatcher.watch("BTCUSD", { watchTicks: true, });

marketWatcher.on("tick", (event) => {
    const { tick, } = event.descriptor;

    console.log(`Bitcoin price is now ${tick.bid} US dollars`);
});
```

How to get the candlesticks of a symbol (candlesticks and bars are generically called periods).
```javascript
const { MidaTimeframe, } = require("@reiryoku/mida");

const periods = await myAccount.getSymbolPeriods("EURUSD", MidaTimeframe.M30);
const lastPeriod = periods[periods.length - 1];

console.log("Last candlestick start time: " + lastPeriod.startTime);
console.log("Last candlestick OHLC: " + lastPeriod.ohlc);
console.log("Last candlestick close price: " + lastPeriod.close);
```

How to listen when candlesticks are closed.
```javascript
const {
    MidaMarketWatcher,
    MidaTimeframe,
} = require("@reiryoku/mida");

const marketWatcher = new MidaMarketWatcher({ brokerAccount: myAccount, });

await marketWatcher.watch("BTCUSD", {
    watchPeriods: true,
    timeframes: [
        MidaTimeframe.M5,
        MidaTimeframe.H1,
    ],
});

marketWatcher.on("period-close", (event) => {
    const { period, } = event.descriptor;

    switch (period.timeframe) {
        case MidaTimeframe.M5: {
            console.log(`M5 candlestick closed at ${period.close}`);

            break;
        }
        case MidaTimeframe.H1: {
            console.log(`H1 candlestick closed at ${period.close}`);

            break;
        }
    }
});
```

### Trading bots (expert advisors)
How to create a trading bot (or expert advisor).
```javascript
const {
    MidaExpertAdvisor,
    MidaTimeframe,
} = require("@reiryoku/mida");

class MyExpertAdvisor extends MidaExpertAdvisor {
    constructor ({ brokerAccount, }) {
        super({ brokerAccount, });
    }

    async configure () {
        await this.marketWatcher.watch("EURUSD", {
            watchTicks: true,
            watchPeriods: true,
            timeframes: [ MidaTimeframe.H1, ],
        });
    }

    async onTick (tick) {
        // Implement your strategy
    }

    async onPeriodClose (period) {
        console.log(`H1 candlestick closed at ${period.open}`);
    }
}
```

How to execute a trading bot.
```javascript
const { MidaBroker, } = require("@reiryoku/mida");
const { MyExpertAdvisor, } = require("./my-expert-advisor");

const myAccount = await MidaBroker.login(/* ... */);
const myAdvisor = new MyExpertAdvisor({ brokerAccount: myAccount, });

await myAdvisor.start();
```

### Technical indicators
Install the plugin providing technical analysis indicators.
```javascript
const { Mida, } = require("@reiryoku/mida");

// Use the Mida Tulipan plugin
Mida.use(require("@reiryoku/mida-tulipan"));
```

How to calculate SMA (Simple Moving Average).
```javascript
const { MidaIndicator, MidaTimeframe, } = require("@reiryoku/mida");

// Get latest candlesticks on H1 timeframe
const candlesticks = await myAccount.getSymbolPeriods("EURUSD", MidaTimeframe.H1);
const closePrices = candlesticks.map((candlestick) => candlestick.close);

// Calculate RSI on close prices, pass values from oldest to newest
const smaValues = await MidaIndicator.new("SMA").calculate(closePrices);

// Values are from oldest to newest
console.log(smaValues);
```

How to calculate RSI (Relative Strength Index).
```javascript
const { MidaIndicator, MidaTimeframe, } = require("@reiryoku/mida");

// Get latest candlesticks on H1 timeframe
const candlesticks = await myAccount.getSymbolPeriods("BTCUSD", MidaTimeframe.H1);
const closePrices = candlesticks.map((candlestick) => candlestick.close);

// Calculate RSI on close prices, pass values from oldest to newest
const rsiValues = await MidaIndicator.new("RSI").calculate(closePrices);

// Values are from oldest to newest
console.log(rsiValues);
```

## License and disclaimer
[LICENSE](./LICENSE).<br>
Trading in financial markets is highly speculative and carries a high level of risk.
It's possible to lose all your capital. This project may not be suitable for everyone,
you should ensure that you understand the risks involved. Furthermore Mida and its authors
are not responsible for any technical inconvenience that may lead to money loss, for example a stop loss not being set.

## Contributors
vasile.peste@reiryoku.com
