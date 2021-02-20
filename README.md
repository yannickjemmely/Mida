<p align="center"> 
    <img src="images/logo.svg" alt="Mida" width="330px">
</p>
<br>

A TypeScript framework to easily operate in financial markets.

Mida is designed to:
- Trade financial assets such as stocks, forex, crypto or commodities;
- Operate with any MetaTrader 4 or MetaTrader 5 broker accounts using only Node.js;
- Automate trading strategies through expert advisors and indicators;
- Backtest expert advisors and ideas on time series covering the last decades;
- Analyze markets and prices movements through indicators and analysis interfaces.

Furthermore, Mida is free and open source.

## Disclaimer
Operating in CFDs/Forex is highly speculative and carries a high level of risk.
It's possible to lose all your capital. These products may not be suitable for everyone,
you should ensure that you understand the risks involved. Furthermore, Mida is not responsible
for commissions and other costs applied to your operations, they depend on your broker.

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


### Symbols
How to check if a symbol is available for your account.
```typescript
const symbol = await myAccount.getSymbol("example");

if (!symbol) {
    console.log("You can't operate with this symbol.");
}
```

### Market Analysis
Examples of market analysis.

#### Candlesticks/Bars
Candlesticks and bars are referred as periods.
```typescript
const periods = await myAccount.getSymbolPeriods("EURUSD", MidaSymbolPeriodTimeframeType.M30);
const lastPeriod = periods[periods.length - 1];

console.log("Last period OHLC => " + lastPeriod.ohlc);
console.log("Last period close price => " + lastPeriod.close);
```

## Contributors
The author and maintainer of the project is [Vasile Pește](https://github.com/Vasile-Peste).
