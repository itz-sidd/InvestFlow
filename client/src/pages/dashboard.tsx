import { useQuery } from "@tanstack/react-query";
import Header from "@/components/navigation/Header";
import MetricsGrid from "@/components/dashboard/MetricsGrid";
import PortfolioChart from "@/components/charts/PortfolioChart";
import AllocationChart from "@/components/charts/AllocationChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import QuickActions from "@/components/dashboard/QuickActions";
import ConnectedAccounts from "@/components/dashboard/ConnectedAccounts";
import InvestmentGoals from "@/components/dashboard/InvestmentGoals";
import { getCurrentUser } from "@/lib/auth";
import { TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { data: user } = useQuery({
    queryKey: ['/api/me'],
    queryFn: getCurrentUser,
  });

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    retry: false,
  });

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">
                Good morning, <span>{user?.firstName}</span>! 👋
              </h1>
              <p className="text-primary-100 text-lg flex items-center">
                Your investments have grown by 
                <span className="font-semibold text-success-300 ml-1 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +$127.34
                </span>
                <span className="ml-1">this week</span>
              </p>
            </div>
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-white rounded-full"></div>
              <div className="absolute -right-12 -bottom-8 w-24 h-24 bg-white rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Key Metrics Grid */}
        <MetricsGrid data={dashboardData} />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Charts and Portfolio */}
          <div className="lg:col-span-2 space-y-8">
            <PortfolioChart />
            <AllocationChart data={dashboardData?.portfolio} />
            <RecentTransactions transactions={dashboardData?.transactions} />
          </div>

          {/* Right Column: Quick Actions and Goals */}
          <div className="space-y-8">
            <QuickActions />
            <ConnectedAccounts accounts={dashboardData?.accounts} />
            <InvestmentGoals goals={dashboardData?.goals} />
            
            {/* Investment Tips */}
            <div className="bg-gradient-to-r from-success-50 to-primary-50 p-6 rounded-xl border border-success-100">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-success-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Investment Tip</h3>
                  <p className="text-sm text-gray-700">
                    Your round-ups are performing well! Consider setting up automatic deposits to accelerate your goal progress.
                  </p>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2">
                    Set up auto-deposit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
