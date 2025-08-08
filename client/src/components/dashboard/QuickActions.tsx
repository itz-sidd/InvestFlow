import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Building, Link, Target } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BankConnectionModal from "@/components/modals/BankConnectionModal";

export default function QuickActions() {
  const [showBankModal, setShowBankModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const investCashMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/invest-cash", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      toast({
        title: "Investment Successful",
        description: "Your available cash has been invested successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Investment Failed",
        description: "There was an error investing your cash. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInvestCash = () => {
    investCashMutation.mutate();
  };

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="space-y-4">
          <Button 
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            onClick={handleInvestCash}
            disabled={investCashMutation.isPending}
          >
            <Plus className="h-4 w-4" />
            <span>{investCashMutation.isPending ? "Investing..." : "Invest Available Cash"}</span>
          </Button>
          
          <Button 
            variant="outline"
            className="w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
          >
            <Building className="h-4 w-4" />
            <span>Add Money</span>
          </Button>
          
          <Button 
            variant="outline"
            className="w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
            onClick={() => setShowBankModal(true)}
          >
            <Link className="h-4 w-4" />
            <span>Connect Account</span>
          </Button>
          
          <Button 
            variant="outline"
            className="w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
          >
            <Target className="h-4 w-4" />
            <span>Set New Goal</span>
          </Button>
        </div>
      </div>

      <BankConnectionModal 
        isOpen={showBankModal}
        onClose={() => setShowBankModal(false)}
      />
    </>
  );
}
