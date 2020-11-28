<p align="center"> 
    <img src="images/logo.svg" alt="" width="390px">
</p>
<br>

MidaFX is an open source framework designed to operate in markets like stocks, forex, crypto or commodities.

Through MidaFX you can:
- Operate in any supported market and manage portfolios in real time;
- Execute, test and automate investment and trading strategies by implementing custom expert advisors;
- Analyze markets and prices movements through dedicated analysis interfaces;
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
async function buyBitcoin (): Promise<void> {
    const myAccount: MidaBrokerAccount = await MidaBrokerManager.login("BDSwiss", {
        id: "123456789",
        password: "",
    });

    const myFirstTrade: MidaPosition = await myAccount.createPosition({
        symbol: "BTCUSD",
        type: MidaPositionType.LONG,
        lots: 1,
    });
    
    console.log(await myFirstTrade.getOpenPrice());
}
```

Opening a forex short position for EUR against USD, with a take profit of 20 pips.
```typescript
import { EUR_USD } from "midafx/forex/MidaForexPairManager";

async function sellEurUsd (): Promise<void> {
    const myAccount: MidaBrokerAccount = await MidaBrokerManager.login("BDSwiss", {
        id: "123456789",
        password: "",
    });

    const lastTick: MidaAssetPairTick = await myAccount.getAssetPairLastTick(EUR_USD);
    const takeProfit: number = lastTick.ask - EUR_USD.normalizePips(20);
    
    const myPosition: MidaPosition = await myAccount.createPosition({
        assetPair: EUR_USD, // A position can be created using the symbol as string or directly the predefined asset pair type like in this case.
        type: MidaPositionType.SHORT,
        lots: 1,
        takeProfit,
    });
}
```

<details><summary>Show more examples</summary>

Opening a short position for Gold against EUR, with a stop loss and take profit.
```typescript
async function sellGold (): Promise<void> {
    const myAccount: MidaBrokerAccount = await MidaBrokerManager.login("BDSwiss", {
        id: "123456789",
        password: "",
    });

    const myPosition: MidaPosition = await myAccount.createPosition({
        symbol: "XAUEUR",
        type: MidaPositionType.SHORT,
        lots: 1,
        stopLoss: 1610.00,
        takeProfit: 1587.00,
    });
    
    console.log(await myFirstTrade.getOpenPrice());
}
```

Opening a long position for Apple stock, with a take profit and event listeners.
```typescript
async function buyAppleShares (): Promise<void> {
    const myAccount: MidaBrokerAccount = await MidaBrokerManager.login("BDSwiss", {
        id: "123456789",
        password: "",
    });

    const myPosition: MidaPosition = await myAccount.createPosition({
        symbol: "#AAPL",
        type: MidaPositionType.LONG,
        lots: 3,
        takeProfit: 67.90,
        events: {
            async open (event: MidaEvent): Promise<void> {
                console.log("The position is now open!");
                console.log("Open price: " + await myPosition.getOpenPrice());
            },
            async tick (event: MidaEvent): Promise<void> {
                const tick: MidaAssetPairTick = event.details.tick;
                
                // Print the position profit each time there is a movement in the market.
                console.log(await myPosition.getProfit());
            },
        },
    });
    
    console.log(await myFirstTrade.getOpenPrice());
}
```

</details>

### Events
Listening the close event of an account position.
```typescript
async function listenPositionCloseEvent (): Promise<void> {
    const myAccount: MidaBrokerAccount = await MidaBrokerManager.login("BDSwiss", {
        id: "123456789",
        password: "",
    });

    myAccount.addEventListener("position close", async (event: MidaEvent): Promise<void> => {
        const position: MidaPosition = event.details.position;
        
        console.log(await position.getProfit());
    });
}
```

## Contributors
The author and maintainer of the project is [Vasile Pește](https://github.com/Vasile-Peste).
