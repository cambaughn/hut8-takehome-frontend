"use client";
import { useState } from "react";

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

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    hashRate: "13200000", // 13.2 EH/s = 13,200,000 TH/s
    power: "665000000", // 665 MW = 665,000,000 W
    costPerKwh: "0.12",
    initialInvestment: "638400000", // 53,200 miners * $12,000 = $638.4M
  });

  const [results, setResults] = useState<MiningResults | null>(null);
  const [error, setError] = useState("");

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
    <div className="min-h-screen p-8 bg-gray-50">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Bitcoin Mining Calculator
        </h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Hash Rate (TH/s)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                required
                className="w-full p-2 border rounded"
                value={formData.hashRate}
                onChange={(e) => setFormData({ ...formData, hashRate: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Power Consumption (W)
              </label>
              <input
                type="number"
                min="0"
                required
                className="w-full p-2 border rounded"
                value={formData.power}
                onChange={(e) => setFormData({ ...formData, power: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Electricity Cost ($/kWh)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                className="w-full p-2 border rounded"
                value={formData.costPerKwh}
                onChange={(e) => setFormData({ ...formData, costPerKwh: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Initial Investment (USD)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                className="w-full p-2 border rounded"
                value={formData.initialInvestment}
                onChange={(e) => setFormData({ ...formData, initialInvestment: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Calculate Profitability
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {results && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Mining Profitability Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-2">Daily</h3>
                <p>Revenue: ${results.dailyRevenueUSD.toLocaleString()} (₿{results.dailyRevenueBTC.toLocaleString(undefined, { minimumFractionDigits: 8 })})</p>
                <p>Cost: ${results.dailyCost.toLocaleString()}</p>
                <p className={`font-medium ${results.dailyProfitUSD >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Profit: ${results.dailyProfitUSD.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Monthly</h3>
                <p>Revenue: ${results.monthlyRevenueUSD.toLocaleString()} (₿{results.monthlyRevenueBTC.toLocaleString(undefined, { minimumFractionDigits: 8 })})</p>
                <p>Cost: ${results.monthlyCost.toLocaleString()}</p>
                <p className={`font-medium ${results.monthlyProfitUSD >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Profit: ${results.monthlyProfitUSD.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Yearly</h3>
                <p>Revenue: ${results.yearlyRevenueUSD.toLocaleString()} (₿{results.yearlyRevenueBTC.toLocaleString(undefined, { minimumFractionDigits: 8 })})</p>
                <p>Cost: ${results.yearlyCost.toLocaleString()}</p>
                <p className={`font-medium ${results.yearlyProfitUSD >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Profit: ${results.yearlyProfitUSD.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-medium mb-2">Additional Metrics</h3>
              <p>Cost to Mine 1 BTC: ${results.costToMine.toLocaleString()}</p>
              <p>Break-even Timeline: {Math.abs(results.breakevenTimeline).toLocaleString(undefined, { minimumFractionDigits: 1 })} days 
                {results.breakevenTimeline < 0 && " (Never - unprofitable at current rates)"}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
