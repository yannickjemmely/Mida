# Roadmap

## Q3 2022
- Add "toFixed()" interface to `MidaDecimal`.
- Integrate the FTX exchange as a plugin.
- Integrate the Bybit exchange as a plugin.

## Q1 2023
- Represent timeframes as strings and no longer as a number of seconds. Months
and higher timeframes are complicated to express as a number of seconds.
- Because of the above, no longer calculate a period end date using its start date + timeframe, take
the end date directly as input.
- Consider subpath exports.

## Q2 2023
- Integrate the Uniswap exchange as a plugin.

## Q3 2023
- For native performance convert `composePeriods()` to AssemblyScript/WebAssembly.
