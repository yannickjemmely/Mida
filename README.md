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
You can use any supported broker as long as you have an account.<br>
MidaFX offers an internal demo broker named `PlaygroundBroker` which you can use to test your
strategies and expert advisors without the risk of losing money.

Login into any supported broker by providing the broker name, your login id and password.
```typescript
const myAccount: MidaBrokerAccount = await MidaBroker.login("example", {
    login: "example",
    password: "example",
});
```

Login into the `PlaygroundBroker`.
```typescript
const myAccount: MidaBrokerAccount = await MidaBroker.login("MidaPlayground");
```

### Opening Positions
All examples assume that you have logged into a broker account.

Opening a long position for Bitcoin against USD.
```typescript
const myOrder: MidaBrokerOrder = await myAccount.placeOrder({
    symbol: "BTCUSD",
    type: MidaBrokerOrderType.BUY,
    size: 1,
});

console.log(await myOrder.getOpenPrice());
```

Opening a forex short position for EUR against USD.
```typescript
const myOrder: MidaBrokerOrder = await myAccount.placeOrder({
    symbol: "EURUSD",
    type: MidaBrokerOrderType.SELL,
    size: 0.1,
});
```

### Market Analysis

#### Candlesticks/Bars
MidaFX refers to candlesticks and bars as periods.

```typescript
const periods: MidaSymbolPeriod[] = await myAccount.getSymbolPeriods("EURUSD", MidaSymbolPeriodTimeframeType.M30);
const lastPeriod: MidaSymbolPeriod = periods[periods.length - 1];

console.log(lastPeriod.ohlc);
```

## Contributors
The author and maintainer of the project is [Vasile Pește](https://github.com/Vasile-Peste).
