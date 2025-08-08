import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, insertAccountSchema, insertTransactionSchema, insertGoalSchema } from "@shared/schema";
import { z } from "zod";

// Mock data for demonstration
function generateMockData() {
  // Create demo user
  const demoUser = {
    username: "demo",
    email: "demo@pennywise.com",
    password: "password123",
    firstName: "Alex",
    lastName: "Johnson"
  };
  
  // Create accounts, transactions, portfolio, etc.
  storage.createUser(demoUser).then(async (user) => {
    // Create accounts
    const checkingAccount = await storage.createAccount({
      userId: user.id,
      bankName: "Chase",
      accountType: "Checking",
      accountNumber: "••••1234",
      balance: "5432.10",
      isConnected: true
    });

    const creditAccount = await storage.createAccount({
      userId: user.id,
      bankName: "Bank of America",
      accountType: "Credit Card",
      accountNumber: "••••5678",
      balance: "0",
      isConnected: true
    });

    // Create portfolio
    const portfolio = await storage.createPortfolio({
      userId: user.id,
      totalValue: "2847.92",
      availableCash: "43.21",
      allocation: {
        "US Stocks": 50,
        "International": 30,
        "Bonds": 10,
        "REITs": 10
      }
    });

    // Create some sample transactions
    const transactions = [
      {
        userId: user.id,
        accountId: checkingAccount.id,
        merchant: "Starbucks",
        amount: "4.87",
        roundUpAmount: "0.13",
        category: "Food & Drink",
        date: new Date("2024-12-15")
      },
      {
        userId: user.id,
        accountId: checkingAccount.id,
        merchant: "Shell Gas Station",
        amount: "32.41",
        roundUpAmount: "0.59",
        category: "Gas",
        date: new Date("2024-12-14")
      },
      {
        userId: user.id,
        accountId: checkingAccount.id,
        merchant: "Chipotle",
        amount: "12.63",
        roundUpAmount: "0.37",
        category: "Food & Drink",
        date: new Date("2024-12-13")
      },
      {
        userId: user.id,
        accountId: checkingAccount.id,
        merchant: "Amazon",
        amount: "47.83",
        roundUpAmount: "0.17",
        category: "Shopping",
        date: new Date("2024-12-12")
      }
    ];

    for (const transaction of transactions) {
      await storage.createTransaction(transaction);
    }

    // Create investment goals
    const goals = [
      {
        userId: user.id,
        name: "Emergency Fund",
        targetAmount: "2000.00",
        currentAmount: "1340.00",
        targetDate: new Date("2025-03-01"),
        icon: "fas fa-home",
        color: "purple"
      },
      {
        userId: user.id,
        name: "New Car",
        targetAmount: "15000.00",
        currentAmount: "1200.00",
        targetDate: new Date("2025-12-01"),
        icon: "fas fa-car",
        color: "blue"
      },
      {
        userId: user.id,
        name: "Vacation",
        targetAmount: "3000.00",
        currentAmount: "450.00",
        targetDate: new Date("2025-06-01"),
        icon: "fas fa-plane",
        color: "green"
      }
    ];

    for (const goal of goals) {
      await storage.createGoal(goal);
    }

    // Create portfolio history for charts
    const dates = [];
    const values = [2650, 2680, 2720, 2695, 2750, 2780, 2820, 2847.92];
    
    for (let i = 7; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date);
    }

    for (let i = 0; i < dates.length; i++) {
      await storage.createPortfolioHistory({
        userId: user.id,
        portfolioId: portfolio.id,
        totalValue: values[i].toString(),
        date: dates[i]
      });
    }

    // Create investments
    const investments = [
      {
        userId: user.id,
        portfolioId: portfolio.id,
        assetType: "US Stocks",
        assetName: "VTSAX",
        shares: "12.5",
        currentPrice: "113.89",
        totalValue: "1423.56"
      },
      {
        userId: user.id,
        portfolioId: portfolio.id,
        assetType: "International",
        assetName: "VTIAX",
        shares: "25.3",
        currentPrice: "33.72",
        totalValue: "853.48"
      },
      {
        userId: user.id,
        portfolioId: portfolio.id,
        assetType: "Bonds",
        assetName: "VBTLX",
        shares: "28.1",
        currentPrice: "10.12",
        totalValue: "284.49"
      },
      {
        userId: user.id,
        portfolioId: portfolio.id,
        assetType: "REITs",
        assetName: "VGSLX",
        shares: "2.8",
        currentPrice: "101.57",
        totalValue: "284.39"
      }
    ];

    for (const investment of investments) {
      await storage.createInvestment(investment);
    }
  });
}

// Initialize mock data
generateMockData();

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      
      // Create initial portfolio
      await storage.createPortfolio({
        userId: user.id,
        totalValue: "0",
        availableCash: "0",
        allocation: {}
      });

      // Store user ID in session
      (req as any).session.userId = user.id;
      
      res.json({ 
        id: user.id, 
        username: user.username, 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Store user ID in session
      (req as any).session.userId = user.id;
      
      res.json({ 
        id: user.id, 
        username: user.username, 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid login data" });
    }
  });

  app.post("/api/logout", (req, res) => {
    if ((req as any).session) {
      (req as any).session.destroy((err: any) => {
        if (err) {
          return res.status(500).json({ message: "Failed to logout" });
        }
        res.json({ message: "Logged out successfully" });
      });
    } else {
      res.json({ message: "Logged out successfully" });
    }
  });

  app.get("/api/me", async (req, res) => {
    const userId = (req as any).session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ 
      id: user.id, 
      username: user.username, 
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
  });

  // Dashboard data
  app.get("/api/dashboard", async (req, res) => {
    const userId = (req as any).session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const [portfolio, accounts, transactions, goals] = await Promise.all([
        storage.getPortfolioByUserId(userId),
        storage.getAccountsByUserId(userId),
        storage.getTransactionsByUserId(userId, 10),
        storage.getGoalsByUserId(userId)
      ]);

      const now = new Date();
      const monthlyRoundups = await storage.getMonthlyRoundups(userId, now.getFullYear(), now.getMonth());

      res.json({
        portfolio,
        accounts,
        transactions,
        goals,
        monthlyRoundups: monthlyRoundups.toFixed(2)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Portfolio routes
  app.get("/api/portfolio", async (req, res) => {
    const userId = (req as any).session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const portfolio = await storage.getPortfolioByUserId(userId);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const investments = await storage.getInvestmentsByPortfolioId(portfolio.id);
    
    res.json({
      ...portfolio,
      investments
    });
  });

  app.get("/api/portfolio/history/:days", async (req, res) => {
    const userId = (req as any).session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const days = parseInt(req.params.days) || 7;
    const portfolio = await storage.getPortfolioByUserId(userId);
    
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const history = await storage.getPortfolioHistory(portfolio.id, days);
    res.json(history);
  });

  // Account routes
  app.get("/api/accounts", async (req, res) => {
    const userId = (req as any).session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const accounts = await storage.getAccountsByUserId(userId);
    res.json(accounts);
  });

  app.post("/api/accounts", async (req, res) => {
    const userId = (req as any).session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const accountData = insertAccountSchema.parse({ ...req.body, userId });
      const account = await storage.createAccount(accountData);
      res.json(account);
    } catch (error) {
      res.status(400).json({ message: "Invalid account data" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    const userId = (req as any).session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const transactions = await storage.getTransactionsByUserId(userId, limit);
    res.json(transactions);
  });

  // Goals routes
  app.get("/api/goals", async (req, res) => {
    const userId = (req as any).session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const goals = await storage.getGoalsByUserId(userId);
    res.json(goals);
  });

  app.post("/api/goals", async (req, res) => {
    const userId = (req as any).session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const goalData = insertGoalSchema.parse({ ...req.body, userId });
      const goal = await storage.createGoal(goalData);
      res.json(goal);
    } catch (error) {
      res.status(400).json({ message: "Invalid goal data" });
    }
  });

  // Investment actions
  app.post("/api/invest-cash", async (req, res) => {
    const userId = (req as any).session?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const { amount } = req.body;
      const portfolio = await storage.getPortfolioByUserId(userId);
      
      if (!portfolio) {
        return res.status(404).json({ message: "Portfolio not found" });
      }

      const availableCash = parseFloat(portfolio.availableCash);
      const investAmount = parseFloat(amount) || availableCash;

      if (investAmount > availableCash) {
        return res.status(400).json({ message: "Insufficient cash available" });
      }

      // Update portfolio
      const newTotalValue = parseFloat(portfolio.totalValue) + investAmount;
      const newAvailableCash = availableCash - investAmount;

      await storage.updatePortfolio(portfolio.id, {
        totalValue: newTotalValue.toFixed(2),
        availableCash: newAvailableCash.toFixed(2)
      });

      res.json({ 
        message: "Investment successful",
        investedAmount: investAmount.toFixed(2),
        newTotalValue: newTotalValue.toFixed(2)
      });
    } catch (error) {
      res.status(500).json({ message: "Investment failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
