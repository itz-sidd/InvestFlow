import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BankConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BankConnectionForm {
  bankName: string;
  accountType: string;
  username: string;
  password: string;
}

export default function BankConnectionModal({ isOpen, onClose }: BankConnectionModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBank, setSelectedBank] = useState("");

  const form = useForm<BankConnectionForm>({
    defaultValues: {
      bankName: "",
      accountType: "Checking",
      username: "",
      password: "",
    },
  });

  const connectAccountMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/accounts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/accounts'] });
      toast({
        title: "Account Connected",
        description: "Your bank account has been successfully connected.",
      });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({
        title: "Connection Failed",
        description: "Failed to connect your bank account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: BankConnectionForm) => {
    // Generate mock account number
    const accountNumber = `••••${Math.floor(1000 + Math.random() * 9000)}`;
    
    connectAccountMutation.mutate({
      bankName: data.bankName,
      accountType: data.accountType,
      accountNumber,
      balance: "1000.00", // Mock balance
      isConnected: true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Your Bank Account</DialogTitle>
          <DialogDescription>
            Securely connect your bank account to enable round-up investments
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-6">
          <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Shield className="h-5 w-5 text-blue-600 mr-3" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">Bank-level security</p>
              <p className="text-blue-700">Your data is encrypted and never stored</p>
            </div>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="bank">Select Your Bank</Label>
            <Select 
              value={selectedBank} 
              onValueChange={(value) => {
                setSelectedBank(value);
                form.setValue("bankName", value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose your bank..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Chase">Chase</SelectItem>
                <SelectItem value="Bank of America">Bank of America</SelectItem>
                <SelectItem value="Wells Fargo">Wells Fargo</SelectItem>
                <SelectItem value="Citi">Citi</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="accountType">Account Type</Label>
            <Select 
              defaultValue="Checking"
              onValueChange={(value) => form.setValue("accountType", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Checking">Checking</SelectItem>
                <SelectItem value="Savings">Savings</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Your bank username"
                {...form.register("username")}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your bank password"
                {...form.register("password")}
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-primary-600 hover:bg-primary-700"
              disabled={connectAccountMutation.isPending || !selectedBank}
            >
              {connectAccountMutation.isPending ? "Connecting..." : "Connect Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
