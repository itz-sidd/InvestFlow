import { Coffee, Car, Utensils, ShoppingCart } from "lucide-react";

interface Transaction {
  id: string;
  merchant: string;
  amount: string;
  roundUpAmount: string;
  date: string;
  category: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Food & Drink":
      return Coffee;
    case "Gas":
      return Car;
    case "Restaurant":
      return Utensils;
    case "Shopping":
      return ShoppingCart;
    default:
      return ShoppingCart;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Food & Drink":
      return "bg-primary-50 text-primary-600";
    case "Gas":
      return "bg-green-50 text-green-600";
    case "Restaurant":
      return "bg-orange-50 text-orange-600";
    case "Shopping":
      return "bg-blue-50 text-blue-600";
    default:
      return "bg-gray-50 text-gray-600";
  }
};

export default function RecentTransactions({ transactions = [] }: RecentTransactionsProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Round-ups</h2>
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View All
        </button>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction) => {
          const IconComponent = getCategoryIcon(transaction.category);
          const iconColor = getCategoryColor(transaction.category);
          const date = new Date(transaction.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          });

          return (
            <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${iconColor} rounded-full flex items-center justify-center`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.merchant}</p>
                  <p className="text-sm text-gray-500">{date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  ${parseFloat(transaction.amount).toFixed(2)}
                </p>
                <p className="text-sm text-success-600">
                  +${parseFloat(transaction.roundUpAmount).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
