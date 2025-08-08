import { useQuery } from "@tanstack/react-query";
import Header from "@/components/navigation/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, CreditCard, Plus } from "lucide-react";
import { useState } from "react";
import BankConnectionModal from "@/components/modals/BankConnectionModal";

export default function Accounts() {
  const [showBankModal, setShowBankModal] = useState(false);

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['/api/accounts'],
    retry: false,
  });

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

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-600">Loading accounts...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Connected Accounts</h1>
            <p className="text-gray-600 mt-2">Manage your linked bank accounts and cards</p>
          </div>
          <Button 
            onClick={() => setShowBankModal(true)}
            className="bg-primary-600 hover:bg-primary-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Connect Account
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts?.map((account: any) => {
            const IconComponent = getAccountIcon(account.accountType);
            const iconColor = getAccountColor(account.bankName);

            return (
              <Card key={account.id}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${iconColor} rounded-full flex items-center justify-center`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{account.bankName}</CardTitle>
                      <CardDescription>{account.accountType}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Account Number</span>
                      <span className="text-sm font-medium">{account.accountNumber}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Balance</span>
                      <span className="text-sm font-medium">
                        ${parseFloat(account.balance).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                        Connected
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Empty state */}
          {(!accounts || accounts.length === 0) && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts connected</h3>
                <p className="text-gray-500 text-center mb-6">
                  Connect your bank account to start earning round-ups on your purchases
                </p>
                <Button 
                  onClick={() => setShowBankModal(true)}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Your First Account
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <BankConnectionModal 
          isOpen={showBankModal}
          onClose={() => setShowBankModal(false)}
        />
      </main>
    </>
  );
}
