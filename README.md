<p align="center"> 
    <img src="images/logo.svg" alt="" width="390px">
</p>
<br>

MidaFX is an open source framework designed to operate in assets markets such as stocks, forex, crypto or commodities.

Through MidaFX you can:
- Real time operate in any supported market;
- Analyze markets and prices movements through dedicated analysis interfaces;
- Execute, test and automate investment and trading strategies by implementing custom expert advisors;
- Backtest and access time series covering the last decades.

## Supported Brokers
At this time the following brokers are supported through official and unofficial integrations.

- BDSwiss

## Installation
```console
npm install midafx
```

## Examples

## Broker Authentication
```typescript
async function buyBitcoin () {
    const myAccount: AMidaBrokerAccount = await MidaBrokers.login("BDSwiss", {
        email: "foo@bar.com",
        password: "*********",
    });

    const myPosition: AMidaPosition = await myAccount.openPosition({
        symbol: "BTCUSD",
        type: MidaPositionType.LONG,
        lots: 1,
    });
    
    console.log(await myFirstTrade.getOpenPrice());
}
```

```typescript
async function sellGold () {
    const myAccount: AMidaBrokerAccount = await MidaBrokers.login("BDSwiss", {
        email: "foo@bar.com",
        password: "*********",
    });

    const myPosition: AMidaPosition = await myAccount.openPosition({
        symbol: "XAUEUR",
        type: MidaPositionType.SHORT,
        lots: 1,
        stopLoss: 1610.00,
        takeProfit: 1587.00,
    });
    
    console.log(await myFirstTrade.getOpenPrice());
}
```

## Contributors
The author and maintainer of the project is [Vasile Pește](https://github.com/Vasile-Peste).
