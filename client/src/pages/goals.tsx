import { useQuery } from "@tanstack/react-query";
import Header from "@/components/navigation/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Home, Car, Plane, Plus, Target } from "lucide-react";

export default function Goals() {
  const { data: goals, isLoading } = useQuery({
    queryKey: ['/api/goals'],
    retry: false,
  });

  const getGoalIcon = (iconName: string) => {
    if (iconName.includes("home")) return Home;
    if (iconName.includes("car")) return Car;
    if (iconName.includes("plane")) return Plane;
    return Target;
  };

  const getGoalColor = (color: string) => {
    switch (color) {
      case "purple":
        return "bg-purple-100 text-purple-600";
      case "blue":
        return "bg-blue-100 text-blue-600";
      case "green":
        return "bg-green-100 text-green-600";
      default:
        return "bg-purple-100 text-purple-600";
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-600">Loading goals...</p>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Investment Goals</h1>
            <p className="text-gray-600 mt-2">Track your progress towards financial milestones</p>
          </div>
          <Button className="bg-primary-600 hover:bg-primary-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Goal
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals?.map((goal: any) => {
            const IconComponent = getGoalIcon(goal.icon);
            const iconColor = getGoalColor(goal.color);
            const current = parseFloat(goal.currentAmount);
            const target = parseFloat(goal.targetAmount);
            const percentage = Math.round((current / target) * 100);
            const targetDate = new Date(goal.targetDate).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric',
              year: 'numeric' 
            });

            return (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${iconColor} rounded-full flex items-center justify-center`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{goal.name}</CardTitle>
                      <CardDescription>Target: {targetDate}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                    
                    <Progress value={percentage} className="h-2" />
                    
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Current</p>
                        <p className="text-lg font-semibold">
                          ${current.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Target</p>
                        <p className="text-lg font-semibold">
                          ${target.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-sm text-gray-500">
                        ${(target - current).toLocaleString()} remaining
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Empty state */}
          {(!goals || goals.length === 0) && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No goals set</h3>
                <p className="text-gray-500 text-center mb-6">
                  Create your first investment goal to start tracking your progress
                </p>
                <Button className="bg-primary-600 hover:bg-primary-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Goal
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}
