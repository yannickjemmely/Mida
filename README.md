<p align="center"> 
    <img src="images/logo.svg" alt="" width="390px">
</p>
<br>

MidaFX is an open source framework designed for trading financial assets like stocks, forex, crypto or commodities.

Through MidaFX you can:
- Real time trade financial assets;
- Execute and automate investment and trading strategies by creating custom expert advisors;
- Backtest expert advisors on time series covering the last decades;
- Analyze markets and prices movements through dedicated analysis interfaces.

## Installation
```console
npm install midafx
```

## Disclaimer
Operating in CFDs/Forex or other assets is highly speculative and carries a high level of risk.
It is possible to lose all your capital. These products may not be suitable for everyone,
you should ensure that you understand the risks involved. Furthermore, MidaFX is not responsible for commissions,
swaps and taxes applied to your operations.

## Usage Examples

### Opening Positions
Opening a long position for Bitcoin against USD.
```typescript
async function buyBitcoin (): Promise<void> {
    const myAccount: MidaBrokerAccount = await MidaBrokerMapper.login("BDSwiss", {
        id: "123456789",
        password: "",
    });

    const myFirstTrade: MidaPosition = await myAccount.createPosition({
        symbol: "BTCUSD",
        type: MidaPositionDirectionType.LONG,
        lots: 1,
    });
    
    // Print the open price.
    console.log(await myFirstTrade.getOpenPrice());
    
    // Print the actual profit.
    console.log(await myFirstTrade.getProfit());
}
```

Opening a forex short position for EUR against USD, with a take profit of 20 pips.
```typescript
import { MidaForexPairMapper } from "midafx/forex/MidaForexPairMapper";

async function sellEurUsd (): Promise<void> {
    const myAccount: MidaBrokerAccount = await MidaBrokerMapper.login("BDSwiss", {
        id: "123456789",
        password: "",
    });

    const forexPair: MidaForexPair = MidaForexPairMapper.getBySymbol("EUR/USD");
    const lastTick: MidaAssetPairTick = await myAccount.getSymbolLastTick(forexPair.symbol);
    const takeProfit: number = lastTick.ask - forexPair.normalizePips(20);

    const myPosition: MidaPosition = await myAccount.createPosition({
        symbol: forexPair.symbol,
        type: MidaPositionDirectionType.SHORT,
        lots: 1,
        takeProfit,
    });
}
```

<details><summary>Show more examples</summary>

Opening a short position for Gold against EUR, with a stop loss and take profit.
```typescript
async function sellGold (): Promise<void> {
    const myAccount: MidaBrokerAccount = await MidaBrokerMapper.login("BDSwiss", {
        id: "123456789",
        password: "",
    });

    const myPosition: MidaPosition = await myAccount.createPosition({
        symbol: "XAUEUR",
        type: MidaPositionDirectionType.SHORT,
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
    const myAccount: MidaBrokerAccount = await MidaBrokerMapper.login("BDSwiss", {
        id: "123456789",
        password: "",
    });

    const myPosition: MidaPosition = await myAccount.createPosition({
        symbol: "#AAPL",
        type: MidaPositionDirectionType.LONG,
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
    const myAccount: MidaBrokerAccount = await MidaBrokerMapper.login("BDSwiss", {
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
