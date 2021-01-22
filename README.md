<p align="center"> 
    <img src="images/logo.svg" alt="MidaFX" width="390px">
</p>
<br>

A TypeScript framework to operate in financial markets.

MidaFX allows to:
- Trade financial assets like stocks, forex, crypto or commodities;
- Execute and automate trading strategies by creating expert advisors and indicators;
- Backtest expert advisors on time series covering the last decades;
- Analyze markets and prices movements through dedicated analysis interfaces.

Furthermore, MidaFX is free and open source.

## Installation
```console
npm install midafx
```

## Disclaimer
Operating in CFDs/Forex is highly speculative and carries a high level of risk.
It's possible to lose all your capital. These products may not be suitable for everyone,
you should ensure that you understand the risks involved. Furthermore, MidaFX is not responsible for commissions,
swaps and other taxes applied to your operations, they depend on your broker.

## Usage

### Broker Login
Login into any supported broker by providing the broker name, your login id and password.
```typescript
const myAccount = await MidaBroker.login("example", {
    login: "example",
    password: "example",
});
```

Login into the `PlaygroundBroker`.
```typescript
const myAccount = await MidaBroker.login("MidaPlayground");
```

### Opening Positions
All examples assume that you have logged into a broker account.

#### Long Position
Opening a long position for Bitcoin against USD.
```typescript
const myOrder = await myAccount.placeOrder({
    symbol: "BTCUSD",
    type: MidaBrokerOrderType.BUY,
    size: 1,
});

console.log(await myOrder.getOpenPrice());
```

#### Short Position
Opening a forex short position for EUR against USD.
```typescript
const myOrder = await myAccount.placeOrder({
    symbol: "EURUSD",
    type: MidaBrokerOrderType.SELL,
    size: 0.1,
});

console.log(await myOrder.getOpenPrice());
```

### Market Analysis

#### Candlesticks/Bars
Candlesticks and bars are referred as periods.

```typescript
const periods = await myAccount.getSymbolPeriods("EURUSD", MidaSymbolPeriodTimeframeType.M30);
const lastPeriod = periods[periods.length - 1];

console.log("Last period OHLC => " + lastPeriod.ohlc);
console.log("Last period close price => " + lastPeriod.close);
```

### Symbols
```typescript
const eurUsd = await myAccount.getSymbol("EURUSD");

eurUsd.on("market-open", () => {
    console.log("EURUSD market has opened.");
});

eurUsd.on("tick", (tick) => {
    console.log(tick.date);
    console.log(tick.bid);
    console.log(tick.ask);
});

eurUsd.on("market-close", () => {
    console.log("EURUSD market has closed.");
});
```

## Contributors
The author and maintainer of the project is [Vasile Pește](https://github.com/Vasile-Peste).
