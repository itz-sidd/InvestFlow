import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Bell, Coins, Menu } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, logout } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const [location] = useLocation();
  const { data: user } = useQuery({
    queryKey: ['/api/me'],
    queryFn: getCurrentUser,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", current: location === "/" || location === "/dashboard" },
    { name: "Invest", href: "/invest", current: location === "/invest" },
    { name: "Accounts", href: "/accounts", current: location === "/accounts" },
    { name: "Goals", href: "/goals", current: location === "/goals" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-2xl font-bold text-primary-700">
              <Coins className="h-8 w-8 mr-2" />
              PennyWise
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  item.current
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="h-5 w-5 text-gray-400" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" />
                    <AvatarFallback>
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden p-2">
              <Menu className="h-5 w-5 text-gray-400" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
