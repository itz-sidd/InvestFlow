import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  bankName: text("bank_name").notNull(),
  accountType: text("account_type").notNull(),
  accountNumber: text("account_number").notNull(),
  balance: decimal("balance", { precision: 12, scale: 2 }).notNull().default("0"),
  isConnected: boolean("is_connected").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  accountId: varchar("account_id").notNull().references(() => accounts.id),
  merchant: text("merchant").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  roundUpAmount: decimal("round_up_amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const portfolios = pgTable("portfolios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  totalValue: decimal("total_value", { precision: 12, scale: 2 }).notNull().default("0"),
  availableCash: decimal("available_cash", { precision: 10, scale: 2 }).notNull().default("0"),
  allocation: jsonb("allocation").notNull().default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const investments = pgTable("investments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id),
  assetType: text("asset_type").notNull(),
  assetName: text("asset_name").notNull(),
  shares: decimal("shares", { precision: 10, scale: 4 }).notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }).notNull(),
  totalValue: decimal("total_value", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  targetAmount: decimal("target_amount", { precision: 12, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 12, scale: 2 }).notNull().default("0"),
  targetDate: timestamp("target_date").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const portfolioHistory = pgTable("portfolio_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  portfolioId: varchar("portfolio_id").notNull().references(() => portfolios.id),
  totalValue: decimal("total_value", { precision: 12, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAccountSchema = createInsertSchema(accounts).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertPortfolioSchema = createInsertSchema(portfolios).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInvestmentSchema = createInsertSchema(investments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
});

export const insertPortfolioHistorySchema = createInsertSchema(portfolioHistory).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Account = typeof accounts.$inferSelect;
export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Portfolio = typeof portfolios.$inferSelect;
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type PortfolioHistory = typeof portfolioHistory.$inferSelect;
export type InsertPortfolioHistory = z.infer<typeof insertPortfolioHistorySchema>;

// Login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginRequest = z.infer<typeof loginSchema>;
