import { TrendingUp, Coins, Wallet, Target } from "lucide-react";

interface MetricsGridProps {
  data: any;
}

export default function MetricsGrid({ data }: MetricsGridProps) {
  const portfolio = data?.portfolio;
  const monthlyRoundups = data?.monthlyRoundups || "0";
  
  // Calculate goal progress (using first goal as example)
  const primaryGoal = data?.goals?.[0];
  const goalProgress = primaryGoal 
    ? Math.round((parseFloat(primaryGoal.currentAmount) / parseFloat(primaryGoal.targetAmount)) * 100)
    : 0;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Portfolio Value */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Portfolio</p>
            <p className="text-2xl font-bold text-gray-900">
              ${parseFloat(portfolio?.totalValue || "0").toLocaleString()}
            </p>
            <p className="text-sm text-success-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.4%
            </p>
          </div>
          <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-primary-600" />
          </div>
        </div>
      </div>

      {/* Round-ups This Month */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Round-ups This Month</p>
            <p className="text-2xl font-bold text-gray-900">
              ${parseFloat(monthlyRoundups).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {data?.transactions?.length || 0} transactions
            </p>
          </div>
          <div className="w-12 h-12 bg-success-50 rounded-full flex items-center justify-center">
            <Coins className="h-6 w-6 text-success-600" />
          </div>
        </div>
      </div>

      {/* Available Cash */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Available Cash</p>
            <p className="text-2xl font-bold text-gray-900">
              ${parseFloat(portfolio?.availableCash || "0").toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Ready to invest</p>
          </div>
          <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
            <Wallet className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Goal Progress */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              {primaryGoal?.name || "Emergency Fund"} Goal
            </p>
            <p className="text-2xl font-bold text-gray-900">{goalProgress}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-primary-600 h-2 rounded-full" 
                style={{ width: `${goalProgress}%` }}
              ></div>
            </div>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
            <Target className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>
    </section>
  );
}
