### Features
* Create interface for getting the order impacted position [#35](https://github.com/Reiryoku-Technologies/Mida/pull/35)

7.1.0 - 12-06-2022
===================
### Features
* Update eslint dependency and cleanup codebase [#31](https://github.com/Reiryoku-Technologies/Mida/pull/31)

7.0.0 - 14-05-2022
===================
### Features
* **_BREAKING_** Refactor part of APIs names to reflect platform-neutrality [#22](https://github.com/Reiryoku-Technologies/Mida/pull/22)

6.0.0 - 23-04-2022
===================
### Features
* Update documentation according to latest API including plugins [#17](https://github.com/Reiryoku-Technologies/Mida/pull/17)
* Create and expose logging API [#18](https://github.com/Reiryoku-Technologies/Mida/pull/18)
* **_BREAKING_** Don't expose logger instance, remove `new` static method from `MidaIndicator` [#21](https://github.com/Reiryoku-Technologies/Mida/pull/21)
* Update documentation, add showcase of supported brokers [#21](https://github.com/Reiryoku-Technologies/Mida/pull/21)
* Reduce requests sent by `MarketWatcher` to the necessary [#21](https://github.com/Reiryoku-Technologies/Mida/pull/21)
* **_BREAKING_** Remove `modifyDirectives` method from `MarketWatcher` (use `watch`) [#21](https://github.com/Reiryoku-Technologies/Mida/pull/21)
* Add `watchTicks`, `watchPeriods` and `unwatch` protected methods to `MidaExpertAdvisor` [#21](https://github.com/Reiryoku-Technologies/Mida/pull/21)

5.0.1 - 31-03-2022
===================
### Bug fixes
* Plugins ids are reintroduced [#16](https://github.com/Reiryoku-Technologies/Mida/pull/16)

5.0.0 - 30-03-2022
===================
### Features
* Update documentation [#12](https://github.com/Reiryoku-Technologies/Mida/pull/12)
* **_BREAKING_** Generic codebase changes and improvements [#13](https://github.com/Reiryoku-Technologies/Mida/pull/13)
* Create position protection change types [#14](https://github.com/Reiryoku-Technologies/Mida/pull/14)
* Create indicators API [#15](https://github.com/Reiryoku-Technologies/Mida/pull/15)

### Bug fixes
* Correctly update position protection when `onProtectionChange` is called [#11](https://github.com/Reiryoku-Technologies/Mida/pull/11)

4.0.0 - 27-02-2022
===================
### Features
* Update documentation ([#6](https://github.com/Reiryoku-Technologies/Mida/pull/6))
* **_BREAKING_** Add assets to symbols, creating a symbol now requires passing the base asset and quote asset, creating an asset no longer requires passing an id ([#5](https://github.com/Reiryoku-Technologies/Mida/pull/5))
* **_BREAKING_** Remove `openPosition` method from broker accounts (use directly `placeOrder`), rename `MidaSymbolPrice` to `MidaSymbolPriceType`, add general improvements ([#7](https://github.com/Reiryoku-Technologies/Mida/pull/7))
* **_BREAKING_** Rename various interfaces, add generic improvements and comments for documentation ([#8](https://github.com/Reiryoku-Technologies/Mida/pull/8))

3.1.0 - 23-01-2022
===================
### Features
* Expose "period-close" event and `getSymbolDirectives` method in `MidaMarketWatcher` ([#3](https://github.com/Reiryoku-Technologies/Mida/pull/3)).

### Bug fixes
* Remove import of `util` module which may throw errors on certain webpack configurations ([#4](https://github.com/Reiryoku-Technologies/Mida/pull/4)).

3.0.0 - 20-01-2022
===================
* **Refactor entire project, introduce orders, deals and positions.**
* Create "MidaTimeframe" API for handling common timeframes.
* Create "MidaDate" API for representing UTC dates.
* Create async event emitter.
* Increment tsconfig.json target to es2020.
* Remove the "getRequiredMargin" method from symbols.
* Remove the "MidaBrowser" and "MidaBrowserTab" APIs.
* Refactor codebase and update to the latest TypeScript version.
* Improve README.md documentation.

2.0.0 - 28-05-2021
===================
* Create "removeEventListener" method for broker accounts and broker orders.
* Create new logo.
* Now the broker accounts "getSymbolLastTick" method can return undefined.
* Create "getSymbolBid" and "getSymbolAsk" methods for broker accounts.
* Create "tick" event for broker orders.
* Create "initiator" field for broker orders.
* Extend error types enumeration.
* Create "tryLogin" method for brokers.
* Create "canPlaceOrder" method for broker accounts, to check if the place order obstacles are equal to zero.
* Create "getPlaceOrderObstacles" method for broker accounts, to get the possible list of errors when placing an order (for example market closed).
* Create error types enumeration.
* Create "tryPlaceOrder" method for broker accounts.
* Create "openOrders" property for expert advisors.
* Create "setViewport" method for browser tabs.
* Plugins installations are now based on ids.
* Remove right click method from browser tabs and create options object in the click method.
* Return string symbols instead of objects when requesting the account symbols.
* Remove export of spread type.
* Remove spread type property from symbols.
* Expose puppeteer page instance in browser tab.
* Define monthly timeframe type.
* Create "rightClick" method for browser tabs.
* Create "evaluateOnNewDocument" method for browser tabs.

1.0.0 - 09-05-2021
===================
