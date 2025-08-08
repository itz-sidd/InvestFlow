import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface AllocationChartProps {
  data: any;
}

export default function AllocationChart({ data }: AllocationChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const allocation = data?.allocation || {
    "US Stocks": 50,
    "International": 30,
    "Bonds": 10,
    "REITs": 10
  };

  const totalValue = parseFloat(data?.totalValue || "2847.92");

  const allocationData = Object.entries(allocation).map(([name, percentage]) => ({
    name,
    percentage: percentage as number,
    value: (totalValue * (percentage as number)) / 100
  }));

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: allocationData.map(item => item.name),
        datasets: [{
          data: allocationData.map(item => item.percentage),
          backgroundColor: [
            '#3B82F6',
            '#10B981',
            '#F59E0B',
            '#8B5CF6'
          ],
          borderWidth: 2,
          borderColor: '#FFFFFF'
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
        cutout: '60%'
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Asset Allocation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-48">
          <canvas ref={chartRef}></canvas>
        </div>
        <div className="space-y-4">
          {allocationData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 ${colors[index]} rounded-full`}></div>
                <span className="font-medium text-gray-700">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-500">{item.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
