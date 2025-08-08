import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login, register, type LoginRequest, type RegisterRequest } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Coins } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export default function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginForm = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "demo@pennywise.com",
      password: "password123",
    },
  });

  const registerForm = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
    },
    onError: () => {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      toast({
        title: "Welcome to PennyWise!",
        description: "Your account has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Registration failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (data: LoginRequest) => {
    loginMutation.mutate(data);
  };

  const handleRegister = (data: RegisterRequest) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Coins className="h-12 w-12 text-primary-600 mr-2" />
            <h1 className="text-3xl font-bold text-primary-700">PennyWise</h1>
          </div>
          <p className="text-gray-600">Smart Micro-Investing Platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...loginForm.register("email")}
                      className={loginForm.formState.errors.email ? "border-red-500" : ""}
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...loginForm.register("password")}
                      className={loginForm.formState.errors.password ? "border-red-500" : ""}
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary-600 hover:bg-primary-700"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
                
                <div className="text-center text-sm text-gray-600">
                  <p>Demo credentials:</p>
                  <p>Email: demo@pennywise.com</p>
                  <p>Password: password123</p>
                </div>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...registerForm.register("firstName")}
                        className={registerForm.formState.errors.firstName ? "border-red-500" : ""}
                      />
                      {registerForm.formState.errors.firstName && (
                        <p className="text-sm text-red-500">{registerForm.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...registerForm.register("lastName")}
                        className={registerForm.formState.errors.lastName ? "border-red-500" : ""}
                      />
                      {registerForm.formState.errors.lastName && (
                        <p className="text-sm text-red-500">{registerForm.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="regUsername">Username</Label>
                    <Input
                      id="regUsername"
                      {...registerForm.register("username")}
                      className={registerForm.formState.errors.username ? "border-red-500" : ""}
                    />
                    {registerForm.formState.errors.username && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.username.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="regEmail">Email</Label>
                    <Input
                      id="regEmail"
                      type="email"
                      {...registerForm.register("email")}
                      className={registerForm.formState.errors.email ? "border-red-500" : ""}
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="regPassword">Password</Label>
                    <Input
                      id="regPassword"
                      type="password"
                      {...registerForm.register("password")}
                      className={registerForm.formState.errors.password ? "border-red-500" : ""}
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary-600 hover:bg-primary-700"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
