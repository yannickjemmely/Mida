<br>
<p align="center"> 
    <img src="images/logo.svg" alt="Mida" width="330px">
</p>
<br>

A JavaScript framework to easily operate in financial markets.

Mida is designed to:
- Trade financial assets such as stocks, crypto, forex or commodities;
- Operate with any MetaTrader broker account using only JavaScript/TypeScript;
- Automate trading strategies through expert advisors and indicators;
- Analyze markets and prices through indicators and analysis tools.

Furthermore, Mida is free and open source.

**This is a work in progress project (the API is not fully implemented, the NPM module is not published).<br>
Please create an issue for questions.**

## Disclaimer
Operating in CFDs/Forex is highly speculative and carries a high level of risk.
It's possible to lose all your capital. These products may not be suitable for everyone,
you should ensure that you understand the risks involved. Furthermore, Mida is not responsible
for: commissions or other taxes applied to your operations, they depend on your broker;
and any technical inconvenience that may lead to money loss, for example a stop loss not being set.

## Usage
For the complete documentation please refer to the [API documentation]().<br>
Operating is possible with any MetaTrader 4/5 broker account.

### Broker account login
How to login into a MetaTrader 4 account.
```typescript
const myAccount = await MidaBroker.login("MT4", {
    id: "",
    password: "",
    serverName: "",
});
```

How to login into a broker directly supported by Mida.
```typescript
const myAccount = await MidaBroker.login("BDSwiss", {
    id: "",
    password: "",
});
```

### Broker orders and positions
How top open a long position for Bitcoin against USD.
```typescript
const myOrder = await myAccount.placeOrder({
    symbol: "BTCUSD",
    type: MidaBrokerOrderType.BUY,
    volume: 1,
});

console.log(myOrder.ticket);
console.log(myOrder.openPrice);
```

How to open a short position for EUR against USD.
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

How to listen the ticks of a symbol.
```typescript
const symbol = await myAccount.getSymbol("#GME");

symbol.on("tick", (event) => {
    const tick = event.descriptor.tick;
    
    console.log(`GameStop share price is now ${tick.bid} dollars.`);
});
```

### Market analysis
Examples of technical market analysis.

#### Candlesticks
How to get the candlesticks of a symbol (candlesticks and bars are referred as periods).
```typescript
const periods = await myAccount.getSymbolPeriods("EURUSD", MidaSymbolPeriodTimeframeType.M30);
const lastPeriod = periods[periods.length - 1];

console.log("Last candlestick OHLC: " + lastPeriod.ohlc);
console.log("Last candlestick close price: " + lastPeriod.close);
```

## Why Mida and not MQL
Nowadays MQL is an obsolete technology and a barrier between
modern traders and algorithmic trading. The mission of Mida is allowing
anyone to operate in financial markets without advanced programming skills or
specific computer requirements. Furthermore, Mida allows operating with MetaTrader
accounts without installing MetaTrader (which is available only for Windows).

## Contributors
The author and maintainer of the project is [Vasile Pește](https://github.com/Vasile-Peste) (vasile.peste@protonmail.ch).
