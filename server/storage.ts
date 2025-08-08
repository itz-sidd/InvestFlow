import { 
  type User, 
  type InsertUser, 
  type Account, 
  type InsertAccount,
  type Transaction,
  type InsertTransaction,
  type Portfolio,
  type InsertPortfolio,
  type Investment,
  type InsertInvestment,
  type Goal,
  type InsertGoal,
  type PortfolioHistory,
  type InsertPortfolioHistory
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Account methods
  getAccountsByUserId(userId: string): Promise<Account[]>;
  getAccount(id: string): Promise<Account | undefined>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccount(id: string, updates: Partial<Account>): Promise<Account | undefined>;
  
  // Transaction methods
  getTransactionsByUserId(userId: string, limit?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getMonthlyRoundups(userId: string, year: number, month: number): Promise<number>;
  
  // Portfolio methods
  getPortfolioByUserId(userId: string): Promise<Portfolio | undefined>;
  createPortfolio(portfolio: InsertPortfolio): Promise<Portfolio>;
  updatePortfolio(id: string, updates: Partial<Portfolio>): Promise<Portfolio | undefined>;
  
  // Investment methods
  getInvestmentsByPortfolioId(portfolioId: string): Promise<Investment[]>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  updateInvestment(id: string, updates: Partial<Investment>): Promise<Investment | undefined>;
  
  // Goal methods
  getGoalsByUserId(userId: string): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: string, updates: Partial<Goal>): Promise<Goal | undefined>;
  
  // Portfolio history methods
  getPortfolioHistory(portfolioId: string, days: number): Promise<PortfolioHistory[]>;
  createPortfolioHistory(history: InsertPortfolioHistory): Promise<PortfolioHistory>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private accounts: Map<string, Account>;
  private transactions: Map<string, Transaction>;
  private portfolios: Map<string, Portfolio>;
  private investments: Map<string, Investment>;
  private goals: Map<string, Goal>;
  private portfolioHistory: Map<string, PortfolioHistory>;

  constructor() {
    this.users = new Map();
    this.accounts = new Map();
    this.transactions = new Map();
    this.portfolios = new Map();
    this.investments = new Map();
    this.goals = new Map();
    this.portfolioHistory = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Account methods
  async getAccountsByUserId(userId: string): Promise<Account[]> {
    return Array.from(this.accounts.values()).filter(account => account.userId === userId);
  }

  async getAccount(id: string): Promise<Account | undefined> {
    return this.accounts.get(id);
  }

  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    const id = randomUUID();
    const account: Account = { 
      ...insertAccount,
      balance: insertAccount.balance || "0",
      isConnected: insertAccount.isConnected !== undefined ? insertAccount.isConnected : true,
      id, 
      createdAt: new Date() 
    };
    this.accounts.set(id, account);
    return account;
  }

  async updateAccount(id: string, updates: Partial<Account>): Promise<Account | undefined> {
    const account = this.accounts.get(id);
    if (!account) return undefined;
    
    const updatedAccount = { ...account, ...updates };
    this.accounts.set(id, updatedAccount);
    return updatedAccount;
  }

  // Transaction methods
  async getTransactionsByUserId(userId: string, limit = 50): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = { 
      ...insertTransaction, 
      id, 
      createdAt: new Date() 
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getMonthlyRoundups(userId: string, year: number, month: number): Promise<number> {
    const transactions = Array.from(this.transactions.values())
      .filter(t => {
        const date = new Date(t.date);
        return t.userId === userId && 
               date.getFullYear() === year && 
               date.getMonth() === month;
      });
    
    return transactions.reduce((sum, t) => sum + parseFloat(t.roundUpAmount), 0);
  }

  // Portfolio methods
  async getPortfolioByUserId(userId: string): Promise<Portfolio | undefined> {
    return Array.from(this.portfolios.values()).find(portfolio => portfolio.userId === userId);
  }

  async createPortfolio(insertPortfolio: InsertPortfolio): Promise<Portfolio> {
    const id = randomUUID();
    const portfolio: Portfolio = { 
      ...insertPortfolio,
      totalValue: insertPortfolio.totalValue || "0",
      availableCash: insertPortfolio.availableCash || "0",
      allocation: insertPortfolio.allocation || {},
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.portfolios.set(id, portfolio);
    return portfolio;
  }

  async updatePortfolio(id: string, updates: Partial<Portfolio>): Promise<Portfolio | undefined> {
    const portfolio = this.portfolios.get(id);
    if (!portfolio) return undefined;
    
    const updatedPortfolio = { ...portfolio, ...updates, updatedAt: new Date() };
    this.portfolios.set(id, updatedPortfolio);
    return updatedPortfolio;
  }

  // Investment methods
  async getInvestmentsByPortfolioId(portfolioId: string): Promise<Investment[]> {
    return Array.from(this.investments.values()).filter(investment => investment.portfolioId === portfolioId);
  }

  async createInvestment(insertInvestment: InsertInvestment): Promise<Investment> {
    const id = randomUUID();
    const investment: Investment = { 
      ...insertInvestment, 
      id, 
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.investments.set(id, investment);
    return investment;
  }

  async updateInvestment(id: string, updates: Partial<Investment>): Promise<Investment | undefined> {
    const investment = this.investments.get(id);
    if (!investment) return undefined;
    
    const updatedInvestment = { ...investment, ...updates, updatedAt: new Date() };
    this.investments.set(id, updatedInvestment);
    return updatedInvestment;
  }

  // Goal methods
  async getGoalsByUserId(userId: string): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(goal => goal.userId === userId);
  }

  async createGoal(insertGoal: InsertGoal): Promise<Goal> {
    const id = randomUUID();
    const goal: Goal = { 
      ...insertGoal,
      currentAmount: insertGoal.currentAmount || "0",
      id, 
      createdAt: new Date() 
    };
    this.goals.set(id, goal);
    return goal;
  }

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal | undefined> {
    const goal = this.goals.get(id);
    if (!goal) return undefined;
    
    const updatedGoal = { ...goal, ...updates };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }

  // Portfolio history methods
  async getPortfolioHistory(portfolioId: string, days: number): Promise<PortfolioHistory[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return Array.from(this.portfolioHistory.values())
      .filter(history => 
        history.portfolioId === portfolioId && 
        new Date(history.date) >= cutoffDate
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async createPortfolioHistory(insertHistory: InsertPortfolioHistory): Promise<PortfolioHistory> {
    const id = randomUUID();
    const history: PortfolioHistory = { ...insertHistory, id };
    this.portfolioHistory.set(id, history);
    return history;
  }
}

export const storage = new MemStorage();
