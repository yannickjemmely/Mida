<p align="center"> 
    <img src="images/logo.svg" alt="Mida" width="330px">
</p>
<br>

A JavaScript/TypeScript framework to easily operate in financial markets.

Mida is designed to:
- Trade financial assets such as stocks, forex, crypto or commodities;
- Operate with any Web MetaTrader 4/5 account using only Node.js;
- Automate trading strategies through expert advisors and indicators;
- Backtest expert advisors and ideas on time series covering the last decades;
- Analyze markets and prices movements through indicators and analysis interfaces.

Furthermore, Mida is free and open source.

## Disclaimer
Operating in CFDs/Forex is highly speculative and carries a high level of risk.
It's possible to lose all your capital. These products may not be suitable for everyone,
you should ensure that you understand the risks involved. Furthermore, Mida is not responsible
for: commissions or other taxes applied to your operations, they depend on your broker;
and any technical inconvenience that may lead to money loss, for example a stop loss not being set.

## Usage
Below some introductory usage examples, for the complete documentation, please
refer to the [API documentation](https://github.com/).
Operating is possible with any broker supporting Web MetaTrader 4/5 and
any broker directly integrated in Mida.

### Broker account login
How to login into a MetaTrader 4 account.
```typescript
const myAccount = await MidaBroker.login("MT4", {
    id: "",
    password: "",
    serverName: "",
});
```

### Broker orders and positions
How top open a crypto long position for Bitcoin against USD.
```typescript
const myOrder = await myAccount.placeOrder({
    symbol: "BTCUSD",
    type: MidaBrokerOrderType.BUY,
    volume: 1,
});

console.log(myOrder.ticket);
console.log(myOrder.openPrice);
```

How to open a forex short position for EUR against USD.
```typescript
const myOrder = await myAccount.placeOrder({
    symbol: "EURUSD",
    type: MidaBrokerOrderType.SELL,
    volume: 0.1,
});

console.log(myOrder.ticket);
console.log(myOrder.openPrice);
```

### Symbols
How to retrieve a symbol.
```typescript
const symbol = await myAccount.getSymbol("#AAPL");

if (!symbol) {
    console.log("Apple stocks are not available for this account!");
}
```

How to get the price of a symbol.
```typescript
const symbol = await myAccount.getSymbol("BTCUSD");
const price: number = await symbol.getBid();

console.log(`Bitcoin price is ${price} dollars.`);
```

### Market analysis
Examples of technical market analysis.

#### Candlesticks
Candlesticks and bars are referred as periods.
```typescript
const candlesticks = await myAccount.getSymbolPeriods("EURUSD", MidaSymbolPeriodTimeframeType.M30);
const lastCandlestick = periods[periods.length - 1];

console.log("Last candlestick OHLC => " + lastCandlestick.ohlc);
console.log("Last candlestick close price => " + lastCandlestick.close);
```

## Why Mida and not MQL
Nowadays MQL is an obsolete technology and a barrier between
modern traders and algorithmic trading. The mission of Mida is allowing
anyone to operate in financial markets without advanced programming skills or
specific computer requirements. Furthermore, Mida allows operating with MetaTrader
accounts without installing MetaTrader or using a VPS.

## Contributors
The author and maintainer of the project is [Vasile Pește](https://github.com/Vasile-Peste).
