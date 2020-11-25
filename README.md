<p align="center"> 
    <img src="images/logo.svg" alt="" width="390px">
</p>
<br>

MidaFX is an open source trading engine designed to operate in assets markets like stocks, forex, crypto or commodities.
The term trading engine is introduced for the first time with this project to indicate not a simple sofware able to
create and close positions but an entire infrastructure and plugin system dedicated to the creation of expert advisors,
market analysis and investment backtesting.

In fact, through MidaFX you can:
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

### Opening Positions
Opening a long position for Bitcoin against USD.
```typescript
async function buyBitcoin () {
    const myAccount: MidaBrokerAccount = await MidaBrokers.login("BDSwiss", {
        id: "123456789",
        password: "",
    });

    const myPosition: MidaPosition = await myAccount.openPosition({
        symbol: "BTCUSD",
        type: MidaPositionType.LONG,
        lots: 1,
    });
    
    console.log(await myFirstTrade.getOpenPrice());
}
```

Opening a short position for Gold against EUR, with a stop loss and take profit.
```typescript
async function sellGold () {
    const myAccount: MidaBrokerAccount = await MidaBrokers.login("BDSwiss", {
        id: "123456789",
        password: "",
    });

    const myPosition: MidaPosition = await myAccount.openPosition({
        symbol: "XAUEUR",
        type: MidaPositionType.SHORT,
        lots: 1,
        stopLoss: 1610.00,
        takeProfit: 1587.00,
    });
    
    console.log(await myFirstTrade.getOpenPrice());
}
```

Opening a long position for Apple stock, with a tick handler (called each time there is a new tick).
```typescript
async function buyAppleShares () {
    const myAccount: MidaBrokerAccount = await MidaBrokers.login("BDSwiss", {
        id: "123456789",
        password: "",
    });

    const myPosition: MidaPosition = await myAccount.openPosition({
        symbol: "#AAPL",
        type: MidaPositionType.LONG,
        lots: 3,
        handlers: {
            tick: async (position: MidaPosition, tick: MidaAssetPairTick) => {
                // Print the position profit each time there is a movement in the market.
                console.log(await position.getProfit());
            },
        },
    });
    
    console.log(await myFirstTrade.getOpenPrice());
}
```

### Events
Opening a long position for Bitcoin against USD.
```typescript
async function example () {
    const myAccount: MidaBrokerAccount = await MidaBrokers.login("BDSwiss", {
        id: "123456789",
        password: "",
    });

    myAccount.addEventListener("XAUUSD tick", (event: MidaEvent) => {
        const tick: MidaAssetPairTick = event.details.tick;
        
        console.log(tick.bid);
    });

    myAccount.addEventListener("position close", async (event: MidaEvent) => {
        const position: MidaPosition = event.details.position;
        
        console.log(await position.getProfit());
    });
}
```

## Contributors
The author and maintainer of the project is [Vasile Pește](https://github.com/Vasile-Peste).
