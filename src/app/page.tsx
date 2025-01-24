"use client";
import { useState, useEffect } from "react";

interface FormData {
  hashRate: string;
  power: string;
  costPerKwh: string;
  initialInvestment: string;
}

interface CalculationPayload {
  hash_rate: number;
  power_consumption: number;
  electricity_cost: number;
  initial_investment: number;
}

interface MiningResults {
  dailyCost: number;
  monthlyCost: number;
  yearlyCost: number;
  dailyRevenueUSD: number;
  monthlyRevenueUSD: number;
  yearlyRevenueUSD: number;
  dailyRevenueBTC: number;
  monthlyRevenueBTC: number;
  yearlyRevenueBTC: number;
  dailyProfitUSD: number;
  monthlyProfitUSD: number;
  yearlyProfitUSD: number;
  breakevenTimeline: number;
  costToMine: number;
}

interface BitcoinPrice {
  bitcoin: {
    usd: number;
  }
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    hashRate: "200", 
    power: "3000", 
    costPerKwh: "0.12",
    initialInvestment: "12000",
  });

  const [results, setResults] = useState<MiningResults | null>(null);
  const [error, setError] = useState("");
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [priceError, setPriceError] = useState("");

  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
        );
        if (!response.ok) throw new Error('Failed to fetch Bitcoin price');
        const data: BitcoinPrice = await response.json();
        setBtcPrice(data.bitcoin.usd);
        setPriceError("");
      } catch (err) {
        console.error('Failed to fetch Bitcoin price:', err);
        setPriceError("Unable to fetch current Bitcoin price");
      }
    };

    fetchBtcPrice();
    // Refresh price every minute
    const interval = setInterval(fetchBtcPrice, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const payload: CalculationPayload = {
        hash_rate: parseFloat(formData.hashRate),
        power_consumption: parseFloat(formData.power),
        electricity_cost: parseFloat(formData.costPerKwh),
        initial_investment: parseFloat(formData.initialInvestment),
      };

      const response = await fetch("http://localhost:8000/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to calculate mining profitability');
      }

      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to calculate mining profitability. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
          Bitcoin Mining Calculator
        </h1>

        <div className="text-center mb-8">
          {btcPrice ? (
            <div className="text-xl text-gray-700 dark:text-gray-300">
              Current BTC Price: <span className="font-semibold text-blue-600 dark:text-blue-400">${btcPrice.toLocaleString()}</span>
            </div>
          ) : (
            <div className="text-gray-600 dark:text-gray-400">
              {priceError || "Loading Bitcoin price..."}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Hash Rate (TH/s)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                required
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.hashRate}
                onChange={(e) => setFormData({ ...formData, hashRate: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Power Consumption (W)
              </label>
              <input
                type="number"
                min="0"
                required
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.power}
                onChange={(e) => setFormData({ ...formData, power: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Electricity Cost ($/kWh)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.costPerKwh}
                onChange={(e) => setFormData({ ...formData, costPerKwh: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Initial Investment (USD)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.initialInvestment}
                onChange={(e) => setFormData({ ...formData, initialInvestment: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-teal-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium shadow-md"
          >
            Calculate Profitability
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-100/80 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {results && (
          <div className="mt-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              Mining Profitability Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Daily</h3>
                <p className="text-gray-700 dark:text-gray-300">Revenue: ${results.dailyRevenueUSD.toLocaleString()} (₿{results.dailyRevenueBTC.toLocaleString(undefined, { minimumFractionDigits: 8 })})</p>
                <p className="text-gray-700 dark:text-gray-300">Cost: ${results.dailyCost.toLocaleString()}</p>
                <p className={`font-medium ${results.dailyProfitUSD >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  Profit: ${results.dailyProfitUSD.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Monthly</h3>
                <p className="text-gray-700 dark:text-gray-300">Revenue: ${results.monthlyRevenueUSD.toLocaleString()} (₿{results.monthlyRevenueBTC.toLocaleString(undefined, { minimumFractionDigits: 8 })})</p>
                <p className="text-gray-700 dark:text-gray-300">Cost: ${results.monthlyCost.toLocaleString()}</p>
                <p className={`font-medium ${results.monthlyProfitUSD >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  Profit: ${results.monthlyProfitUSD.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Yearly</h3>
                <p className="text-gray-700 dark:text-gray-300">Revenue: ${results.yearlyRevenueUSD.toLocaleString()} (₿{results.yearlyRevenueBTC.toLocaleString(undefined, { minimumFractionDigits: 8 })})</p>
                <p className="text-gray-700 dark:text-gray-300">Cost: ${results.yearlyCost.toLocaleString()}</p>
                <p className={`font-medium ${results.yearlyProfitUSD >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  Profit: ${results.yearlyProfitUSD.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-white">Additional Metrics</h3>
              <p className="text-gray-700 dark:text-gray-300">Cost to Mine 1 BTC: ${results.costToMine.toLocaleString()}</p>
              <p className="text-gray-700 dark:text-gray-300">Break-even Timeline: {Math.abs(results.breakevenTimeline).toLocaleString(undefined, { minimumFractionDigits: 1 })} days 
                {results.breakevenTimeline < 0 && " (Never - unprofitable at current rates)"}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
