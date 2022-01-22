### Features
* Expose "period-close" event and `getSymbolDirectives` method in `MidaMarketWatcher` ([#3](https://github.com/Reiryoku-Technologies/Mida/pull/3)).

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
