import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Chart, registerables } from "chart.js";
import type { PortfolioHistory } from "@shared/schema";

Chart.register(...registerables);

export default function PortfolioChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const { data: portfolioHistory } = useQuery<PortfolioHistory[]>({
    queryKey: ['/api/portfolio/history/7'],
    retry: false,
  });

  useEffect(() => {
    if (!chartRef.current || !portfolioHistory || !Array.isArray(portfolioHistory)) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const labels = portfolioHistory.map((item: any) => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const values = portfolioHistory.map((item: any) => parseFloat(item.totalValue));

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Portfolio Value',
          data: values,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: function(value) {
                return '$' + Number(value).toLocaleString();
              }
            },
            grid: {
              color: '#F3F4F6'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        elements: {
          point: {
            radius: 4,
            hoverRadius: 6
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [portfolioHistory]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Portfolio Performance</h2>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button className="px-3 py-1 text-sm font-medium bg-white text-primary-600 rounded shadow-sm">7D</button>
          <button className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-700">1M</button>
          <button className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-700">3M</button>
          <button className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-700">1Y</button>
        </div>
      </div>
      <div className="h-64">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
