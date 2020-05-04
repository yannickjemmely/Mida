import { MidaEconomicFactor } from "#factors/MidaEconomicFactor";
import { MidaEconomicFactorSet } from "#factors/MidaEconomicFactorSet";
import { MidaEconomicFactorStatement, getCurrencyStrengthDirection } from "#factors/MidaEconomicFactorStatement";
import { MidaEconomicFactorStatementCurrencyPrediction } from "#factors/MidaEconomicFactorStatementCurrencyPrediction";
import { MidaMarket } from "#market/MidaMarket";
import { MidaEconomicScraper } from "#scrapers/MidaEconomicScraper";
import { MidaUtilities } from "#utilities/MidaUtilities";

export class MidaEconomist {
    private static readonly _factors: MidaEconomicFactorSet = new MidaEconomicFactorSet();

    private constructor () {
        // Silence is golden.
    }

    public static defineEconomicFactor (factor: MidaEconomicFactor): void {
        if (this._factors.has(factor.name)) {
            throw new Error();
        }

        this._factors.add(factor);
    }

    public static getEconomicFactor (name: string): MidaEconomicFactor {
        const factor: MidaEconomicFactor | null = this._factors.get(name);

        if (!factor) {
            throw new Error();
        }

        return factor;
    }

    public static getEconomicFactorsByCurrency (currencyID: string): MidaEconomicFactor[] {
        return this._factors.getByCurrency(currencyID);
    }

    public static async getStatementsScheduledToday (currencyID?: string): Promise<MidaEconomicFactorStatement[]> {
        const statements: MidaEconomicFactorStatement[] = [];
        const factors: MidaEconomicFactor[] = currencyID ? this.getEconomicFactorsByCurrency(currencyID) : this._factors.valuesToArray();

        for (const factor of factors) {
            const statement: MidaEconomicFactorStatement = await factor.getLatestStatement();

            if (
                MidaUtilities.getDaysBetweenDates(statement.date, new Date()) === 0 ||
                (statement.nextStatementDate && MidaUtilities.getDaysBetweenDates(statement.nextStatementDate, new Date()) === 0)
            ) {
                statements.push(statement);
            }
        }

        return statements;
    }
}

export function defineEconomicFactor (factor: MidaEconomicFactor): void {
    MidaEconomist.defineEconomicFactor(factor);
}

//////////
// Factors
//////////

// Used to fetch the latest economic statement from a webpage.
async function _fetchLatestEconomicStatement (factor: MidaEconomicFactor, uri: string, positiveBearish: boolean): Promise<MidaEconomicFactorStatement> {
    const statement: MidaEconomicFactorStatement = {
        factor,
        ...(await MidaEconomicScraper.fetchLatestEconomicStatement(uri)),
    };

    statement.makeCurrencyPrediction = (currencyID: string): MidaEconomicFactorStatementCurrencyPrediction => {
        return {
            statement: statement,
            date: new Date(),
            currency: MidaMarket.getCurrency(currencyID),
            strengthDirection: getCurrencyStrengthDirection(currencyID, statement, positiveBearish),
        };
    };

    return statement;
}

// U.S. Unemployment Rate
defineEconomicFactor({
    name: "U.S. Unemployment Rate",
    description: "",
    influencedCurrencies: {
        "USD": 10,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/unemployment-rate-300", true);
    },
});

// U.S. Export Price Index MoM
defineEconomicFactor({
    name: "U.S. Export Price Index MoM",
    description: "",
    influencedCurrencies: {
        "USD": 9,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/export-price-index-892", false);
    },
});

// CFTC EUR Speculative Net Positions
defineEconomicFactor({
    name: "CFTC EUR Speculative Net Positions",
    description: "",
    influencedCurrencies: {
        "EUR": 5,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/cftc-eur-speculative-positions-1611", false);
    },
});

// U.S. Import Price Index MoM
defineEconomicFactor({
    name: "U.S. Import Price Index MoM",
    description: "",
    influencedCurrencies: {
        "USD": 9,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/import-price-index-153", false);
    },
});

// U.S. Industrial Production MoM
defineEconomicFactor({
    name: "U.S. Industrial Production MoM",
    description: "",
    influencedCurrencies: {
        "USD": 5,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/industrial-production-161", false);
    },
});

// U.S. Initial Jobless Claims
defineEconomicFactor({
    name: "U.S. Initial Jobless Claims",
    description: "",
    influencedCurrencies: {
        "USD": 10,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/initial-jobless-claims-294", true);
    },
});

// U.S. Manufacturing Production MoM
defineEconomicFactor({
    name: "U.S. Manufacturing Production MoM",
    description: "",
    influencedCurrencies: {
        "USD": 4,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/manufacturing-output-1307", false);
    },
});

// U.S. Crude Oil Inventories
defineEconomicFactor({
    name: "U.S. Crude Oil Inventories",
    description: "",
    influencedCurrencies: {
        "USD": 9,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/eia-crude-oil-inventories-75", true);
    },
});

// U.S. CB Consumer Confidence
defineEconomicFactor({
    name: "U.S. CB Consumer Confidences",
    description: "",
    influencedCurrencies: {
        "USD": 9,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/cb-consumer-confidence-48", false);
    },
});

// U.S. Existing Home Sales
defineEconomicFactor({
    name: "U.S. Existing Home Sales",
    description: "",
    influencedCurrencies: {
        "USD": 9,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/existing-home-sales-99", false);
    },
});

// U.S. Redbook MoM
defineEconomicFactor({
    name: "U.S. Redbook MoM",
    description: "",
    influencedCurrencies: {
        "USD": 3,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/redbook-655", false);
    },
});

// U.S. Chicago Fed National Activity
defineEconomicFactor({
    name: "U.S. Chicago Fed National Activity",
    description: "",
    influencedCurrencies: {
        "USD": 4,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/chicago-fed-national-activity-523", false);
    },
});

// Eurozone Industrial Production MoM
defineEconomicFactor({
    name: "Eurozone Industrial Production MoM",
    description: "",
    influencedCurrencies: {
        "EUR": 7,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/industrial-production-160", false);
    },
});

// Netherlands Unemployment Rate
defineEconomicFactor({
    name: "Netherlands Unemployment Rate",
    description: "",
    influencedCurrencies: {
        "EUR": 4,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/dutch-unemployment-rate-609", true);
    },
});

// Eurozone Consumer Price Index (CPI) MoM
defineEconomicFactor({
    name: "Eurozone Consumer Price Index (CPI) MoM",
    description: "",
    influencedCurrencies: {
        "EUR": 5,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/cpi-928", false);
    },
});

// France Car Registration MoM
defineEconomicFactor({
    name: "France Car Registration MoM",
    description: "",
    influencedCurrencies: {
        "EUR": 3,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/french-car-registration-1927", false);
    },
});

// France Car Registration YoY
defineEconomicFactor({
    name: "France Car Registration YoY",
    description: "",
    influencedCurrencies: {
        "EUR": 5,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/french-car-registration-1928", false);
    },
});

// Italy Car Registration MoM
defineEconomicFactor({
    name: "Italy Car Registration MoM",
    description: "",
    influencedCurrencies: {
        "EUR": 3,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/italian-car-registration-1922", false);
    },
});

// Italy Car Registration YoY
defineEconomicFactor({
    name: "Italy Car Registration YoY",
    description: "",
    influencedCurrencies: {
        "EUR": 5,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/italian-car-registration-1923", false);
    },
});

// Italy Trade Balance
defineEconomicFactor({
    name: "Italy Trade Balance",
    description: "",
    influencedCurrencies: {
        "EUR": 4,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/italian-trade-balance-182", false);
    },
});

// Italy Trade Balance EU
defineEconomicFactor({
    name: "Italy Trade Balance EU",
    description: "",
    influencedCurrencies: {
        "EUR": 4,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/italian-trade-balance-eu-954", false);
    },
});

// Germany Car Registration MoM
defineEconomicFactor({
    name: "Germany Car Registration MoM",
    description: "",
    influencedCurrencies: {
        "EUR": 4,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/german-car-registration-1891", false);
    },
});

// Germany Car Registration YoY
defineEconomicFactor({
    name: "Germany Car Registration YoY",
    description: "",
    influencedCurrencies: {
        "EUR": 6,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/german-car-registration-1892", false);
    },
});

// Eurozone Consumer Price Index (CPI) YoY
defineEconomicFactor({
    name: "Eurozone CPI YoY",
    description: "",
    influencedCurrencies: {
        "EUR": 10,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/cpi-68", false);
    },
});

// Eurozone Trade Balance
defineEconomicFactor({
    name: "Eurozone Trade Balance",
    description: "",
    influencedCurrencies: {
        "EUR": 10,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/trade-balance-287", false);
    },
});

// Eurozone ZEW Economic Sentiment
defineEconomicFactor({
    name: "Eurozone ZEW",
    description: "",
    influencedCurrencies: {
        "EUR": 10,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/zew-economic-sentiment-310", false);
    },
});

// France Consumer Price Index (CPI) MoM
defineEconomicFactor({
    name: "France Consumer Price Index (CPI) MoM",
    description: "",
    influencedCurrencies: {
        "EUR": 6,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/french-cpi-112", false);
    },
});

// Germany Ifo Business Climate Index
defineEconomicFactor({
    name: "Germany Ifo Business Climate Index",
    description: "",
    influencedCurrencies: {
        "EUR": 9,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/german-ifo-business-climate-index-132", false);
    },
});

// Germany Manufacturing Purchasing Managers Index (PMI)
defineEconomicFactor({
    name: "Germany Manufacturing Purchasing Managers Index (PMI)",
    description: "",
    influencedCurrencies: {
        "EUR": 10,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/german-manufacturing-pmi-136", false);
    },
});

// U.S. Core Retail Sales MoM
defineEconomicFactor({
    name: "U.S. Core Retail Sales MoM",
    description: "",
    influencedCurrencies: {
        "USD": 10,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/core-retail-sales-63", false);
    },
});

// U.S. Retail Sales MoM
defineEconomicFactor({
    name: "U.S. Retail Sales MoM",
    description: "",
    influencedCurrencies: {
        "USD": 10,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/retail-sales-256", false);
    },
});

// Italy Consumer Price Index (CPI) MoM
defineEconomicFactor({
    name: "Italy Consumer Price Index (CPI) MoM",
    description: "",
    influencedCurrencies: {
        "EUR": 7,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/italian-cpi-178", false);
    },
});

// Italy Consumer Price Index (CPI) YoY
defineEconomicFactor({
    name: "Italy Consumer Price Index (CPI) YoY",
    description: "",
    influencedCurrencies: {
        "EUR": 3,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/italian-cpi-748", false);
    },
});

// U.S. Housing Starts
defineEconomicFactor({
    name: "U.S. Housing Starts",
    description: "",
    influencedCurrencies: {
        "USD": 7,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/housing-starts-151", false);
    },
});

// U.S. TIC Net Long-Term Transactions
defineEconomicFactor({
    name: "U.S. TIC Net Long-Term Transactions",
    description: "",
    influencedCurrencies: {
        "USD": 8,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/tic-net-long-term-transactions-283", false);
    },
});

// U.S. Housing Starts MoM
defineEconomicFactor({
    name: "U.S. Housing Starts MoM",
    description: "",
    influencedCurrencies: {
        "USD": 7,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/housing-starts-898", false);
    },
});

// U.S. Business Inventories MoM
defineEconomicFactor({
    name: "U.S. Business Inventories MoM",
    description: "",
    influencedCurrencies: {
        "USD": 6,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/business-inventories-29", true);
    },
});

// U.S. Philadelphia Fed Manufacturing Index
defineEconomicFactor({
    name: "U.S. Philadelphia Fed Manufacturing Index",
    description: "",
    influencedCurrencies: {
        "USD": 9,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/philadelphia-fed-manufacturing-index-236", false);
    },
});

// U.S. Nonfarm Payrolls
defineEconomicFactor({
    name: "U.S. Nonfarm Payrolls",
    description: "",
    influencedCurrencies: {
        "USD": 10,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/nonfarm-payrolls-227", false);
    },
});

// U.S. Natural Gas Storage
defineEconomicFactor({
    name: "U.S. Natural Gas Storage",
    description: "",
    influencedCurrencies: {
        "USD": 4,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/natural-gas-storage-386", true);
    },
});

// Canada Wholesale Sales MoM
defineEconomicFactor({
    name: "Canada Wholesale Sales MoM",
    description: "",
    influencedCurrencies: {
        "CAD": 5,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/wholesale-sales-306", false);
    },
});

// Canada Core Retail Sales MoM
defineEconomicFactor({
    name: "Canada Core Retail Sales MoM",
    description: "",
    influencedCurrencies: {
        "CAD": 10,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/core-retail-sales-65", false);
    },
});

// Canada Retail Sales MoM
defineEconomicFactor({
    name: "Canada Retail Sales MoM",
    description: "",
    influencedCurrencies: {
        "CAD": 5,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/retail-sales-260", false);
    },
});

// Canada Interest Rate Decision
defineEconomicFactor({
    name: "Canada Interest Rate Decision",
    description: "",
    influencedCurrencies: {
        "CAD": 9,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/interest-rate-decision-166", false);
    },
});

// Canada Manufacturing Sales MoM
defineEconomicFactor({
    name: "Canada Manufacturing Sales MoM",
    description: "",
    influencedCurrencies: {
        "CAD": 6,
    },
    async getLatestStatement (): Promise<MidaEconomicFactorStatement> {
        return _fetchLatestEconomicStatement(this,"https://www.investing.com/economic-calendar/manufacturing-sales-207", false);
    },
});
