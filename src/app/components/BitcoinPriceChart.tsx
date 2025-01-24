"use client";
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceData {
  prices: [number, number][]; // [timestamp, price]
}

interface BitcoinPriceChartProps {
  isDarkMode?: boolean;
}

export default function BitcoinPriceChart({ isDarkMode = false }: BitcoinPriceChartProps) {
  const [priceHistory, setPriceHistory] = useState<PriceData | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchPriceHistory = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily'
        );
        if (!response.ok) throw new Error('Failed to fetch price history');
        const data: PriceData = await response.json();
        setPriceHistory(data);
      } catch (err) {
        console.error('Failed to fetch price history:', err);
        setError("Unable to load price history");
      }
    };

    fetchPriceHistory();
  }, []);

  if (error) return <div className="text-red-600 dark:text-red-400 text-center">{error}</div>;
  if (!priceHistory) return <div className="text-gray-600 dark:text-gray-400 text-center">Loading price history...</div>;

  const chartData = {
    labels: priceHistory.prices.map(([timestamp]) => 
      new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ),
    datasets: [
      {
        label: 'Bitcoin Price (USD)',
        data: priceHistory.prices.map(([, price]) => price),
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => `$${context.parsed.y.toLocaleString()}`,
        },
        padding: 12,
        backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDarkMode ? '#fff' : '#000',
        bodyColor: isDarkMode ? '#fff' : '#000',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#4b5563',
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#4b5563',
          callback: (value) => `$${value.toLocaleString()}`,
          font: {
            size: 11,
          },
        },
        position: 'right',
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
        30-Day Price History
      </h3>
      <div className="h-[400px] w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
} 