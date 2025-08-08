import { Home, Car, Plane } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  targetAmount: string;
  currentAmount: string;
  targetDate: string;
  icon: string;
  color: string;
}

interface InvestmentGoalsProps {
  goals: Goal[];
}

const getGoalIcon = (iconName: string) => {
  if (iconName.includes("home")) return Home;
  if (iconName.includes("car")) return Car;
  if (iconName.includes("plane")) return Plane;
  return Home;
};

const getGoalColor = (color: string) => {
  switch (color) {
    case "purple":
      return "text-purple-600 bg-purple-600";
    case "blue":
      return "text-blue-600 bg-blue-600";
    case "green":
      return "text-green-600 bg-green-600";
    default:
      return "text-purple-600 bg-purple-600";
  }
};

export default function InvestmentGoals({ goals = [] }: InvestmentGoalsProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Investment Goals</h2>
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          Edit
        </button>
      </div>
      <div className="space-y-6">
        {goals.map((goal) => {
          const IconComponent = getGoalIcon(goal.icon);
          const iconColor = getGoalColor(goal.color);
          const current = parseFloat(goal.currentAmount);
          const target = parseFloat(goal.targetAmount);
          const percentage = Math.round((current / target) * 100);
          const targetDate = new Date(goal.targetDate).toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          });

          return (
            <div key={goal.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <IconComponent className={iconColor.split(' ')[0]} />
                  <span className="font-medium text-gray-900">{goal.name}</span>
                </div>
                <div className="text-sm text-gray-500">
                  ${current.toLocaleString()} / ${target.toLocaleString()}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${iconColor.split(' ')[1]}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">Target: {targetDate}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
