<br><br>
<p align="center"> 
    <img src="images/logo.svg" alt="Mida" width="352px">
</p>
<br>
<p align="center">
    <b>A JavaScript framework to easily operate in global financial markets</b>
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
Mida is a framework designed to trade financial assets such as stocks, crypto, forex or commodities,
create solid and maintainable expert advisors on large scale, analyze markets and cover all the necessities of
retail and institutional algorithmic traders.

Join the [Discord](https://discord.gg/cKyWTUsr3q) and [Telegram](https://t.me/joinmida) community.
<br>

## Installation
```console
npm i @reiryoku/mida
```

To use cTrader broker accounts, also install the Mida cTrader plugin
```console
npm i @reiryoku/mida-ctrader
```

## Usage
### Broker account login
How to login into a cTrader broker account.
```javascript
const { Mida, MidaBroker, } = require("@reiryoku/mida");

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

To get a `clientId`, `clientSecret` and `accessToken` you must create an account on
[cTrader Open API](https://connect.spotware.com).

### Broker orders and positions
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
            console.log("Your broker account doesn't support trading Apple stocks!");

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

How to open volume for an open position
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

How to close volume for an open position
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

How to close an open position
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

### Symbols
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

### Expert advisors
How to create an expert advisor.
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
        // Implement your strategy.
    }
    
    async onPeriodClose (period) {
        console.log(`H1 candlestick closed at ${period.open}`);
    }
}
```

How to execute an expert advisor.
```javascript
const { MidaBroker, } = require("@reiryoku/mida");
const { MyExpertAdvisor, } = require("./my-expert-advisor"); 

const myAccount = await MidaBroker.login(/* ... */);
const myAdvisor = new MyExpertAdvisor({ brokerAccount: myAccount, });

await myAdvisor.start();
```

### Candlesticks
How to get the candlesticks of a symbol (candlesticks and bars are generically called periods).
```javascript
const { MidaTimeframe, } = require("@reiryoku/mida");

const periods = await myAccount.getSymbolPeriods("EURUSD", MidaTimeframe.M30);
const lastPeriod = periods[periods.length - 1];

console.log("Last candlestick start time: " + lastPeriod.startTime);
console.log("Last candlestick OHLC: " + lastPeriod.ohlc);
console.log("Last candlestick close price: " + lastPeriod.close);
```

## Disclaimer
Operating in CFDs/Forex and generically in financial markets is highly speculative and carries a high level of risk.
It's possible to lose all your capital. These products may not be suitable for everyone,
you should ensure that you understand the risks involved. Furthermore, Mida is not responsible
for commissions and other taxes applied to your operations, they depend on your broker or exchange. Mida and its authors
are also not responsible for any technical inconvenience that may lead to money loss, for example a stop loss not being set.

## Contributors
The author and maintainer of the project is [Vasile Pește](https://github.com/Vasile-Peste) (vasile.peste@protonmail.ch).
