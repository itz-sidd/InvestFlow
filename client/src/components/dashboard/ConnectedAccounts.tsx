import { Building, CreditCard } from "lucide-react";

interface Account {
  id: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  isConnected: boolean;
}

interface ConnectedAccountsProps {
  accounts: Account[];
}

export default function ConnectedAccounts({ accounts = [] }: ConnectedAccountsProps) {
  const getAccountIcon = (accountType: string) => {
    return accountType === "Credit Card" ? CreditCard : Building;
  };

  const getAccountColor = (bankName: string) => {
    switch (bankName.toLowerCase()) {
      case "chase":
        return "bg-blue-100 text-blue-600";
      case "bank of america":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Connected Accounts</h2>
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          Manage
        </button>
      </div>
      <div className="space-y-4">
        {accounts.map((account) => {
          const IconComponent = getAccountIcon(account.accountType);
          const iconColor = getAccountColor(account.bankName);

          return (
            <div key={account.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${iconColor} rounded-full flex items-center justify-center`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{account.bankName} {account.accountType}</p>
                  <p className="text-sm text-gray-500">{account.accountNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                  Connected
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
