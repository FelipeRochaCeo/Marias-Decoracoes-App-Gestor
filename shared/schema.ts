import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("Funcionário"),
  status: text("status").notNull().default("ativo"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  role: true,
});

// Roles and Permissions
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  permissions: text("permissions").array().notNull(),
});

export const insertRoleSchema = createInsertSchema(roles);

// Inventory Items
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull().default(0),
  minQuantity: integer("min_quantity").notNull().default(5),
  maxQuantity: integer("max_quantity").notNull(),
  unit: text("unit").notNull(),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).pick({
  name: true,
  category: true,
  quantity: true,
  minQuantity: true,
  maxQuantity: true,
  unit: true,
});

// Shopping List
export const shoppingList = pgTable("shopping_list", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unit: text("unit").notNull(),
  status: text("status").notNull().default("pending"),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertShoppingItemSchema = createInsertSchema(shoppingList).pick({
  name: true,
  category: true,
  quantity: true,
  unit: true,
  createdBy: true,
});

// Inventory Counts
export const inventoryCounts = pgTable("inventory_counts", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull().defaultNow(),
  userId: integer("user_id").notNull(),
  itemsChecked: integer("items_checked").notNull(),
  notes: text("notes"),
});

export const insertInventoryCountSchema = createInsertSchema(inventoryCounts).pick({
  userId: true,
  itemsChecked: true,
  notes: true,
});

// Tasks
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("a fazer"),
  priority: text("priority").notNull().default("média"),
  assignee: integer("assignee"),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  dueDate: timestamp("due_date"),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  status: true,
  priority: true,
  assignee: true,
  createdBy: true,
  dueDate: true,
});

// Feedback
export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  visibility: text("visibility").notNull().default("all"),
  status: text("status").notNull().default("aberto"),
  submittedBy: integer("submitted_by").notNull(),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const insertFeedbackSchema = createInsertSchema(feedback).pick({
  title: true,
  description: true,
  type: true,
  visibility: true,
  submittedBy: true,
});

// Messages for chat
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  channelId: text("channel_id").notNull(),
  sender: integer("sender").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  mentions: integer("mentions").array(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  channelId: true,
  sender: true,
  content: true,
  mentions: true,
});

// Channels for chat
export const channels = pgTable("channels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull().default("channel"), // channel or direct
  participants: integer("participants").array(),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertChannelSchema = createInsertSchema(channels).pick({
  name: true,
  type: true,
  participants: true,
  createdBy: true,
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  type: text("type").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  linkTo: text("link_to"),
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  title: true,
  body: true,
  type: true,
  linkTo: true,
});

// System Configuration
export const systemConfig = pgTable("system_config", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  updatedBy: integer("updated_by").notNull(),
});

export const insertSystemConfigSchema = createInsertSchema(systemConfig).pick({
  key: true,
  value: true,
  updatedBy: true,
});

// Configuration history
export const configHistory = pgTable("config_history", {
  id: serial("id").primaryKey(),
  configKey: text("config_key").notNull(),
  previousValue: jsonb("previous_value"),
  newValue: jsonb("new_value").notNull(),
  changes: text("changes").array(),
  updatedBy: integer("updated_by").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertConfigHistorySchema = createInsertSchema(configHistory).pick({
  configKey: true,
  previousValue: true,
  newValue: true,
  changes: true,
  updatedBy: true,
});

// Modules registry
export const modules = pgTable("modules", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  dependencies: text("dependencies").array(),
  permissions: text("permissions").array().notNull(),
  active: boolean("active").notNull().default(true),
  registeredAt: timestamp("registered_at").notNull().defaultNow(),
  registeredBy: integer("registered_by").notNull(),
});

export const insertModuleSchema = createInsertSchema(modules).pick({
  id: true,
  name: true,
  dependencies: true,
  permissions: true,
  registeredBy: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Role = typeof roles.$inferSelect;
export type InsertRole = z.infer<typeof insertRoleSchema>;

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;

export type ShoppingItem = typeof shoppingList.$inferSelect;
export type InsertShoppingItem = z.infer<typeof insertShoppingItemSchema>;

export type InventoryCount = typeof inventoryCounts.$inferSelect;
export type InsertInventoryCount = z.infer<typeof insertInventoryCountSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Channel = typeof channels.$inferSelect;
export type InsertChannel = z.infer<typeof insertChannelSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type SystemConfig = typeof systemConfig.$inferSelect;
export type InsertSystemConfig = z.infer<typeof insertSystemConfigSchema>;

export type ConfigHistory = typeof configHistory.$inferSelect;
export type InsertConfigHistory = z.infer<typeof insertConfigHistorySchema>;

export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;
