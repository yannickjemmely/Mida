<br>
<p align="center"> 
    <img src="images/logo.svg" alt="Mida" width="330px">
</p>
<br>

A JavaScript framework to easily operate in global financial markets.

Mida is designed to:
- Trade financial assets such as stocks, crypto, forex or commodities;
- Operate with any broker account using only JavaScript/TypeScript;
- Automate and backtest trading strategies through expert advisors;
- Analyze market prices with indicators and analysis interfaces.

Furthermore, Mida is free and open source, join the [Discord community](https://discord.gg/cKyWTUsr3q).

<br>
<p align="center"> 
    <img src="images/introduction.svg" alt="" width="860px">
</p>
<br>

## Installation
The easiest way to install Mida is using the following command in your project directory.
```console
npm install @reiryoku/mida
```

## Usage
Mida is creating a common API to operate in global financial markets with MetaTrader, cTrader and other brokers/exchanges APIs.

### Broker account login
How to login into a MetaTrader 5 broker.
```javascript
const { MidaBroker } = require("@reiryoku/mida");

const myAccount = await MidaBroker.login("MT5", {
    id: "foo",
    password: "bar",
    serverName: "FooBar",
});
```

How to login into an independent broker.
```javascript
const { MidaBroker } = require("@reiryoku/mida");

const myAccount = await MidaBroker.login("ICMarkets", {
    email: "foo@bar.com",
    id: "foo",
    password: "bar",
});
```

### Broker orders and positions
How top open a long position for Bitcoin against USD.
```javascript
const { MidaBrokerOrderType } = require("@reiryoku/mida");

const myOrder = await myAccount.placeOrder({
    symbol: "BTCUSD",
    type: MidaBrokerOrderType.BUY,
    lots: 1,
});

console.log(myOrder.ticket);
console.log(myOrder.openPrice);
```

How to open a short position for EUR against USD.
```javascript
const { MidaBrokerOrderType } = require("@reiryoku/mida");

const myOrder = await myAccount.placeOrder({
    symbol: "EURUSD",
    type: MidaBrokerOrderType.SELL,
    lots: 0.1,
});

console.log(myOrder.ticket);
console.log(myOrder.openPrice);
```

<details><summary>More examples</summary>

How to open a long position for GBP against USD with stop loss and take profit.
```javascript
const { MidaBrokerOrderType } = require("@reiryoku/mida");

const symbol = "GBPUSD";
const lastTick = await myAccount.getSymbolLastTick(symbol);
const myOrder = await myAccount.placeOrder({
    symbol,
    type: MidaBrokerOrderType.BUY,
    lots: 0.1,
    stopLoss: lastTick.bid - 0.0010, // Stop loss of 10 pips.
    takeProfit: lastTick.bid + 0.0030, // Take profit of 30 pips.
});
```

</details>

### Symbols
How to retrieve a symbol.
```javascript
const symbol = await myAccount.getSymbol("#AAPL");

if (!symbol) {
    console.log("Apple stocks are not available for this account!");
}
else {
    console.log(symbol.digits);
    console.log(symbol.leverage);
}
```

How to get the price of a symbol.
```javascript
const symbol = await myAccount.getSymbol("BTCUSD");
const price = await symbol.getBid();

console.log(`Bitcoin price is ${price} dollars.`);
```

How to listen the ticks of a symbol.
```javascript
const symbol = await myAccount.getSymbol("#GME");

symbol.on("tick", (event) => {
    const tick = event.descriptor.tick;
    
    console.log(`GameStop share price is now ${tick.bid} dollars.`);
});
```

### Market analysis and indicators
Examples of technical market analysis.

#### Candlesticks
How to get the candlesticks of a symbol (in the code candlesticks and bars are generally referred as periods).
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
const relativeStrengthIndex = await MidaIndicator.calculate("RSI", {
    prices: periods.map((period) => period.close),
    length: 14,
});
```

#### Bollinger Bands
How to calculate the Bollinger Bands indicator for Ethereum on M5 chart.
```javascript
const {
    MidaIndicator,
    MidaTimeframeType,
} = require("@reiryoku/mida");

const periods = await myAccount.getSymbolPeriods("ETHUSD", MidaTimeframeType.M5);
const bollingerBands = await MidaIndicator.calculate("BollingerBands", {
    prices: periods.map((period) => period.close),
    length: 20,
});
```

### Practice and backtest
Playground is a local broker created for paper trading and backtesting.
To use Playground first add the plugin to your dependencies.
```json
{
    "dependencies": {
        "@reiryoku/mida": "1.0.0",
        "@reiryoku/mida-playground": "1.0.0"
    }
}
```

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

const myAdvisor = new MyExpertAdvisor({
    brokerAccount: myAccount,
});

await myAdvisor.start();
await myAccount.elapseTime(60 * 60 * 24); // Elapse 1 hour, this will trigger ticks and candles.

console.log(myAdvisor.orders); // The orders created by the EA in one hour.
```

## Disclaimer
Operating in CFDs/Forex is highly speculative and carries a high level of risk.
It's possible to lose all your capital. These products may not be suitable for everyone,
you should ensure that you understand the risks involved. Furthermore, Mida is not responsible
for commissions or other taxes applied to your operations, they depend on your broker,
and any technical inconvenience that may lead to money loss, for example a stop loss not being set.

## Why Mida and not MQL
Nowadays MQL is a procedural technology and a barrier between
modern traders and algorithmic trading. The mission of Mida is allowing
anyone to operate in financial markets without advanced programming skills or
specific computer requirements. Furthermore, Mida allows operating with MetaTrader
accounts without installing MetaTrader (which is available only for Windows OS).

## Contributors
The author and maintainer of the project is [Vasile Pește](https://github.com/Vasile-Peste) (vasile.peste@protonmail.ch).
