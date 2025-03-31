import { 
  User, InsertUser, 
  Role, InsertRole,
  InventoryItem, InsertInventoryItem,
  ShoppingItem, InsertShoppingItem,
  InventoryCount, InsertInventoryCount,
  Task, InsertTask,
  Feedback, InsertFeedback,
  Message, InsertMessage,
  Channel, InsertChannel,
  Notification, InsertNotification,
  SystemConfig, InsertSystemConfig,
  ConfigHistory, InsertConfigHistory,
  Module, InsertModule
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  listUsers(): Promise<User[]>;
  
  // Role operations
  getRole(id: number): Promise<Role | undefined>;
  getRoleByName(name: string): Promise<Role | undefined>;
  createRole(role: InsertRole): Promise<Role>;
  listRoles(): Promise<Role[]>;
  
  // Inventory operations
  getInventoryItem(id: number): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: number, updates: Partial<InventoryItem>): Promise<InventoryItem | undefined>;
  listInventoryItems(): Promise<InventoryItem[]>;
  
  // Shopping list operations
  getShoppingItem(id: number): Promise<ShoppingItem | undefined>;
  createShoppingItem(item: InsertShoppingItem): Promise<ShoppingItem>;
  updateShoppingItem(id: number, updates: Partial<ShoppingItem>): Promise<ShoppingItem | undefined>;
  listShoppingItems(): Promise<ShoppingItem[]>;
  
  // Inventory count operations
  createInventoryCount(count: InsertInventoryCount): Promise<InventoryCount>;
  listInventoryCounts(): Promise<InventoryCount[]>;
  
  // Task operations
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined>;
  listTasks(): Promise<Task[]>;
  
  // Feedback operations
  getFeedback(id: number): Promise<Feedback | undefined>;
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  updateFeedback(id: number, updates: Partial<Feedback>): Promise<Feedback | undefined>;
  listFeedback(): Promise<Feedback[]>;
  
  // Chat operations
  createMessage(message: InsertMessage): Promise<Message>;
  listMessages(channelId: string): Promise<Message[]>;
  getChannel(id: number): Promise<Channel | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel>;
  listChannels(): Promise<Channel[]>;
  
  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  listUserNotifications(userId: number): Promise<Notification[]>;
  markNotificationRead(id: number): Promise<Notification | undefined>;
  
  // System configuration operations
  getSystemConfig(key: string): Promise<SystemConfig | undefined>;
  setSystemConfig(config: InsertSystemConfig): Promise<SystemConfig>;
  createConfigHistory(history: InsertConfigHistory): Promise<ConfigHistory>;
  listConfigHistory(key: string): Promise<ConfigHistory[]>;
  
  // Module operations
  getModule(id: string): Promise<Module | undefined>;
  createModule(module: InsertModule): Promise<Module>;
  updateModule(id: string, updates: Partial<Module>): Promise<Module | undefined>;
  listModules(): Promise<Module[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private roles: Map<number, Role>;
  private inventoryItems: Map<number, InventoryItem>;
  private shoppingItems: Map<number, ShoppingItem>;
  private inventoryCounts: Map<number, InventoryCount>;
  private tasks: Map<number, Task>;
  private feedback: Map<number, Feedback>;
  private messages: Map<number, Message>;
  private channels: Map<number, Channel>;
  private notifications: Map<number, Notification>;
  private systemConfig: Map<string, SystemConfig>;
  private configHistory: Map<number, ConfigHistory>;
  private modules: Map<string, Module>;
  
  // Auto-increment counters
  private userId: number;
  private roleId: number;
  private inventoryItemId: number;
  private shoppingItemId: number;
  private inventoryCountId: number;
  private taskId: number;
  private feedbackId: number;
  private messageId: number;
  private channelId: number;
  private notificationId: number;
  private systemConfigId: number;
  private configHistoryId: number;
  
  constructor() {
    // Initialize maps
    this.users = new Map();
    this.roles = new Map();
    this.inventoryItems = new Map();
    this.shoppingItems = new Map();
    this.inventoryCounts = new Map();
    this.tasks = new Map();
    this.feedback = new Map();
    this.messages = new Map();
    this.channels = new Map();
    this.notifications = new Map();
    this.systemConfig = new Map();
    this.configHistory = new Map();
    this.modules = new Map();
    
    // Initialize IDs
    this.userId = 1;
    this.roleId = 1;
    this.inventoryItemId = 1;
    this.shoppingItemId = 1;
    this.inventoryCountId = 1;
    this.taskId = 1;
    this.feedbackId = 1;
    this.messageId = 1;
    this.channelId = 1;
    this.notificationId = 1;
    this.systemConfigId = 1;
    this.configHistoryId = 1;
    
    // Initialize with default data
    this.seedData();
  }
  
  private seedData() {
    // Create default admin user
    this.createUser({
      username: "admin",
      password: "$2b$10$eSfXPEMkS4jWQk4q/CRAHeZwbcQ0T7Ux6nQVaXTOmSMrYcS0T/XVK", // hashed "admin123"
      name: "Admin User",
      email: "admin@example.com",
      role: "Admin"
    });
    
    // Create default roles
    this.createRole({
      name: "Admin",
      permissions: ["*"]
    });
    
    this.createRole({
      name: "Manager",
      permissions: ["dashboard", "inventory", "team", "chat", "tasks", "feedback"]
    });
    
    this.createRole({
      name: "Employee",
      permissions: ["dashboard", "inventory_view", "chat", "tasks"]
    });
    
    // Create default modules
    this.createModule({
      id: "core-dashboard",
      name: "Dashboard",
      dependencies: [],
      permissions: ["dashboard"],
      registeredBy: 1
    });
    
    this.createModule({
      id: "core-inventory",
      name: "Inventory Management",
      dependencies: [],
      permissions: ["inventory", "inventory_view"],
      registeredBy: 1
    });
    
    this.createModule({
      id: "core-tasks",
      name: "Task Management",
      dependencies: [],
      permissions: ["tasks"],
      registeredBy: 1
    });
    
    // Set default system config
    this.setSystemConfig({
      key: "theme",
      value: {
        primary: "hsl(222.2 47.4% 11.2%)",
        variant: "professional",
        appearance: "light",
        radius: 0.5
      },
      updatedBy: 1
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { ...user, id, status: "active" };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async listUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Role operations
  async getRole(id: number): Promise<Role | undefined> {
    return this.roles.get(id);
  }
  
  async getRoleByName(name: string): Promise<Role | undefined> {
    return Array.from(this.roles.values()).find(role => role.name === name);
  }
  
  async createRole(role: InsertRole): Promise<Role> {
    const id = this.roleId++;
    const newRole: Role = { ...role, id };
    this.roles.set(id, newRole);
    return newRole;
  }
  
  async listRoles(): Promise<Role[]> {
    return Array.from(this.roles.values());
  }
  
  // Inventory operations
  async getInventoryItem(id: number): Promise<InventoryItem | undefined> {
    return this.inventoryItems.get(id);
  }
  
  async createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const id = this.inventoryItemId++;
    const newItem: InventoryItem = { ...item, id };
    this.inventoryItems.set(id, newItem);
    return newItem;
  }
  
  async updateInventoryItem(id: number, updates: Partial<InventoryItem>): Promise<InventoryItem | undefined> {
    const item = this.inventoryItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates };
    this.inventoryItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async listInventoryItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventoryItems.values());
  }
  
  // Shopping list operations
  async getShoppingItem(id: number): Promise<ShoppingItem | undefined> {
    return this.shoppingItems.get(id);
  }
  
  async createShoppingItem(item: InsertShoppingItem): Promise<ShoppingItem> {
    const id = this.shoppingItemId++;
    const newItem: ShoppingItem = { 
      ...item, 
      id, 
      status: "pending", 
      createdAt: new Date() 
    };
    this.shoppingItems.set(id, newItem);
    return newItem;
  }
  
  async updateShoppingItem(id: number, updates: Partial<ShoppingItem>): Promise<ShoppingItem | undefined> {
    const item = this.shoppingItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...updates };
    this.shoppingItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async listShoppingItems(): Promise<ShoppingItem[]> {
    return Array.from(this.shoppingItems.values());
  }
  
  // Inventory count operations
  async createInventoryCount(count: InsertInventoryCount): Promise<InventoryCount> {
    const id = this.inventoryCountId++;
    const newCount: InventoryCount = { 
      ...count, 
      id, 
      date: new Date() 
    };
    this.inventoryCounts.set(id, newCount);
    return newCount;
  }
  
  async listInventoryCounts(): Promise<InventoryCount[]> {
    return Array.from(this.inventoryCounts.values());
  }
  
  // Task operations
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }
  
  async createTask(task: InsertTask): Promise<Task> {
    const id = this.taskId++;
    const newTask: Task = { 
      ...task, 
      id, 
      status: task.status || "todo",
      priority: task.priority || "medium",
      createdAt: new Date(),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined
    };
    this.tasks.set(id, newTask);
    return newTask;
  }
  
  async updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
  
  async listTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }
  
  // Feedback operations
  async getFeedback(id: number): Promise<Feedback | undefined> {
    return this.feedback.get(id);
  }
  
  async createFeedback(feedback: InsertFeedback): Promise<Feedback> {
    const id = this.feedbackId++;
    const newFeedback: Feedback = { 
      ...feedback, 
      id, 
      status: "open",
      submittedAt: new Date()
    };
    this.feedback.set(id, newFeedback);
    return newFeedback;
  }
  
  async updateFeedback(id: number, updates: Partial<Feedback>): Promise<Feedback | undefined> {
    const feedback = this.feedback.get(id);
    if (!feedback) return undefined;
    
    const updatedFeedback = { ...feedback, ...updates };
    this.feedback.set(id, updatedFeedback);
    return updatedFeedback;
  }
  
  async listFeedback(): Promise<Feedback[]> {
    return Array.from(this.feedback.values());
  }
  
  // Chat operations
  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const newMessage: Message = { 
      ...message, 
      id, 
      timestamp: new Date(),
      mentions: message.mentions || []
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }
  
  async listMessages(channelId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.channelId === channelId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
  
  async getChannel(id: number): Promise<Channel | undefined> {
    return this.channels.get(id);
  }
  
  async createChannel(channel: InsertChannel): Promise<Channel> {
    const id = this.channelId++;
    const newChannel: Channel = { 
      ...channel, 
      id, 
      type: channel.type || "channel",
      participants: channel.participants || [],
      createdAt: new Date()
    };
    this.channels.set(id, newChannel);
    return newChannel;
  }
  
  async listChannels(): Promise<Channel[]> {
    return Array.from(this.channels.values());
  }
  
  // Notification operations
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = this.notificationId++;
    const newNotification: Notification = { 
      ...notification, 
      id, 
      read: false,
      createdAt: new Date()
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }
  
  async listUserNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async markNotificationRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    
    const updatedNotification = { ...notification, read: true };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }
  
  // System configuration operations
  async getSystemConfig(key: string): Promise<SystemConfig | undefined> {
    return Array.from(this.systemConfig.values()).find(config => config.key === key);
  }
  
  async setSystemConfig(config: InsertSystemConfig): Promise<SystemConfig> {
    // Get previous config for history
    const prevConfig = await this.getSystemConfig(config.key);
    
    // Create or update config
    let systemConfig: SystemConfig;
    if (prevConfig) {
      systemConfig = { 
        ...prevConfig, 
        value: config.value, 
        lastUpdated: new Date(),
        updatedBy: config.updatedBy
      };
      this.systemConfig.set(prevConfig.id, systemConfig);
    } else {
      const id = this.systemConfigId++;
      systemConfig = { 
        ...config, 
        id, 
        lastUpdated: new Date() 
      };
      this.systemConfig.set(id, systemConfig);
    }
    
    // Create history entry if there was a previous value
    if (prevConfig) {
      await this.createConfigHistory({
        configKey: config.key,
        previousValue: prevConfig.value,
        newValue: config.value,
        changes: [],
        updatedBy: config.updatedBy
      });
    }
    
    return systemConfig;
  }
  
  async createConfigHistory(history: InsertConfigHistory): Promise<ConfigHistory> {
    const id = this.configHistoryId++;
    const newHistory: ConfigHistory = { 
      ...history, 
      id, 
      timestamp: new Date() 
    };
    this.configHistory.set(id, newHistory);
    return newHistory;
  }
  
  async listConfigHistory(key: string): Promise<ConfigHistory[]> {
    return Array.from(this.configHistory.values())
      .filter(history => history.configKey === key)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  // Module operations
  async getModule(id: string): Promise<Module | undefined> {
    return this.modules.get(id);
  }
  
  async createModule(module: InsertModule): Promise<Module> {
    const newModule: Module = { 
      ...module, 
      dependencies: module.dependencies || [],
      active: true,
      registeredAt: new Date()
    };
    this.modules.set(module.id, newModule);
    return newModule;
  }
  
  async updateModule(id: string, updates: Partial<Module>): Promise<Module | undefined> {
    const module = this.modules.get(id);
    if (!module) return undefined;
    
    const updatedModule = { ...module, ...updates };
    this.modules.set(id, updatedModule);
    return updatedModule;
  }
  
  async listModules(): Promise<Module[]> {
    return Array.from(this.modules.values());
  }
}

export const storage = new MemStorage();
