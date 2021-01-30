<p align="center"> 
    <img src="images/logo.svg" alt="MidaFX" width="390px">
</p>
<br>

A TypeScript framework to easily operate in financial markets.

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

### Positions

#### Orders
How top open a long position for BTC against USD.
```typescript
const myOrder = await myAccount.placeOrder({
    symbol: "BTCUSD",
    type: MidaBrokerOrderType.BUY,
    size: 1,
});

console.log(await myOrder.getOpenPrice());
```

How to open a short position for EUR against USD.
```typescript
const myOrder = await myAccount.placeOrder({
    symbol: "EURUSD",
    type: MidaBrokerOrderType.SELL,
    size: 0.1,
});

console.log(await myOrder.getOpenPrice());
```

#### Profit
How to get the net profit of a position.
```typescript
const actualProfit = await myOrder.getProfit();

console.log(actualProfit);
```

How to get the gross profit of a position.
```typescript
const grossProfit = await myOrder.getGrossProfit();

console.log(grossProfit);
```

How to get the commision and swaps of a position.
```typescript
console.log(await myOrder.getCommision());
console.log(await myOrder.getSwaps());
```

#### Management
How to close a position.
```typescript
await myOrder.close();
```

How to change the stop loss and take profit of a position.
```typescript
await myOrder.setStopLoss(10);
await myOrder.setTakeProfit(30);
```

How to remove the stop loss and take profit of a position.
```typescript
await myOrder.clearStopLoss();
await myOrder.clearTakeProfit();
```

### Symbols
How to check if a symbol is available for your account.
```typescript
const symbol = await myAccount.getSymbol("example");

if (!symbol) {
    console.log("You can't operate with this symbol.");
}
```

How to listen to the events of a symbol.
```typescript
const eurUsd = await myAccount.getSymbol("EURUSD");

eurUsd.on("market-open", () => {
    console.log("EURUSD market has opened.");
});

eurUsd.on("tick", (tick) => {
    console.log(tick.bid);
    console.log(tick.ask);
    console.log(tick.spread);
});

eurUsd.on("market-close", () => {
    console.log("EURUSD market has closed.");
});
```

### Market Analysis
Usage examples of the interfaces provided for market analysis.

#### Candlesticks/Bars
Candlesticks and bars are referred as periods.
```typescript
const periods = await myAccount.getSymbolPeriods("EURUSD", MidaSymbolPeriodTimeframeType.M30);
const lastPeriod = periods[periods.length - 1];

console.log("Last period OHLC => " + lastPeriod.ohlc);
console.log("Last period close price => " + lastPeriod.close);
```

#### Indicators
How to calculate the SMA (Simple Moving Average).
```typescript
const sma = new MidaSmaIndicator(periods);

console.log(await sma.calculate());
console.log(await sma.next(period));
```

## Contributors
The author and maintainer of the project is [Vasile Pește](https://github.com/Vasile-Peste).
