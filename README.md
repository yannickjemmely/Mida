<p align="center"> 
    <img src="images/logo.svg" alt="MidaFX" width="390px">
</p>
<br>

MidaFX is an open source TypeScript framework designed to operate in financial markets.

Specifically MidaFX allows to:
- Trade financial assets like stocks, forex, crypto or commodities;
- Execute and automate trading strategies by creating expert advisors and indicators;
- Backtest expert advisors on time series covering the last decades;
- Analyze markets and prices movements through dedicated analysis interfaces.

## Installation
```console
npm install midafx
```

## Disclaimer
Operating in CFDs/Forex is highly speculative and carries a high level of risk.
It is possible to lose all your capital. These products may not be suitable for everyone,
you should ensure that you understand the risks involved. Furthermore, MidaFX is not responsible for commissions,
swaps and other taxes applied to your operations, they depend on your broker.

## Usage Examples

### Opening Positions
Opening a long position for Bitcoin against USD.

```typescript
const myAccount: MidaBrokerAccount = await MidaBroker.login("BDSwiss", {
    login: "root",
    password: "root",
});

const myOrder: MidaBrokerOrder = await myAccount.placeOrder({
    symbol: "BTCUSD",
    type: MidaBrokerPositionType.LONG,
    size: 0.1,
});
const myPosition: MidaBrokerPosition = await myOrder.getPosition();

// Print the open price.
console.log(await myPosition.getOpenPrice());
```

Opening a forex short position for EUR against USD, with a take profit of 20 pips.

```typescript
const forexPair: string = "EURUSD";
const lastTick: MidaSymbolTick = await myAccount.getSymbolLastTick(forexPair);
const myPosition: MidaBrokerPosition = await myAccount.placeOrder({
    symbol: forexPair,
    type: MidaBrokerPositionType.SHORT,
    lots: 0.1,
    takeProfit: lastTick.ask - MidaSymbol.normalizePips(forexPair, 20),
});
```

<details><summary>Show more examples</summary>

Opening a short position for Gold against EUR, with a stop loss and take profit.
```typescript

```

Opening a long position for Apple stock, with a take profit and event listeners.
```typescript

```

</details>

### Events
Listening the close event of an account position.
```typescript

```

## Contributors
The author and maintainer of the project is [Vasile Pește](https://github.com/Vasile-Peste).
