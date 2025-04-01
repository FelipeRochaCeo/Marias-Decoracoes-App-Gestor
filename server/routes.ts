import express, { Request, Response } from "express";
import { WebSocketServer, WebSocket } from "ws";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import passport from "passport";
import { 
  insertUserSchema, 
  insertRoleSchema,
  insertInventoryItemSchema,
  insertShoppingItemSchema,
  insertInventoryCountSchema,
  insertTaskSchema,
  insertFeedbackSchema,
  insertMessageSchema,
  insertChannelSchema,
  insertNotificationSchema,
  insertSystemConfigSchema,
  insertModuleSchema,
  User
} from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// WebSocket client tracking
const clients = new Map<WebSocket, { userId: number }>();

export async function registerRoutes(app: Express): Promise<Server> {
  const router = express.Router();
  const httpServer = createServer(app);
  
  // Set up WebSocket server for real-time features
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    // Initially set a placeholder userId, will be updated after authentication
    clients.set(ws, { userId: -1 });
    
    ws.on('message', async (messageBuffer) => {
      try {
        const message = JSON.parse(messageBuffer.toString());
        
        // Handle different message types
        if (message.type === 'auth') {
          // Authenticate WebSocket connection
          // In a real app, validate token or session
          const { userId } = message;
          clients.set(ws, { userId });
          
          // Send confirmation
          ws.send(JSON.stringify({ type: 'auth_success' }));
        } 
        else if (message.type === 'chat_message') {
          // Handle chat messages
          const client = clients.get(ws);
          if (!client || client.userId === -1) {
            ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
            return;
          }
          
          const { channelId, content, mentions } = message;
          
          // Store the message
          const newMessage = await storage.createMessage({
            channelId,
            sender: client.userId,
            content,
            mentions
          });
          
          // Broadcast to connected clients
          const outgoingMessage = {
            type: 'new_message',
            message: newMessage
          };
          
          for (const [client, metadata] of clients.entries()) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(outgoingMessage));
            }
          }
          
          // Create notifications for mentions
          if (mentions && mentions.length > 0) {
            for (const mentionedUserId of mentions) {
              await storage.createNotification({
                userId: mentionedUserId,
                title: "New Mention",
                body: `You were mentioned in a message by ${client.userId}`,
                type: "mention",
                linkTo: `/chat?channel=${channelId}`
              });
              
              // Send real-time notification to mentioned user
              for (const [client, metadata] of clients.entries()) {
                if (metadata.userId === mentionedUserId && client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify({
                    type: 'notification',
                    notification: {
                      title: "New Mention",
                      body: `You were mentioned in a message`,
                      link: `/chat?channel=${channelId}`
                    }
                  }));
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    });
    
    ws.on('close', () => {
      clients.delete(ws);
    });
  });
  
  // Error handling middleware for validation
  const validateRequest = (schema: z.ZodSchema<any>) => {
    return (req: Request, res: Response, next: Function) => {
      try {
        req.body = schema.parse(req.body);
        next();
      } catch (err) {
        if (err instanceof ZodError) {
          const validationError = fromZodError(err);
          res.status(400).json({ message: validationError.message });
        } else {
          res.status(400).json({ message: "Invalid request data" });
        }
      }
    };
  };
  
  // Authentication check middleware
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Não autorizado" });
    }
    next();
  };
  
  // Permission check middleware
  const requirePermission = (permission: string) => {
    return async (req: Request, res: Response, next: Function) => {
      const user = req.user as User;
      
      if (!user) {
        return res.status(401).json({ message: "Não autorizado" });
      }
      
      try {
        const role = await storage.getRoleByName(user.role);
        
        if (!role) {
          return res.status(403).json({ message: "Papel inválido" });
        }
        
        if (role.permissions.includes("*") || role.permissions.includes(permission)) {
          next();
        } else {
          res.status(403).json({ message: "Permissões insuficientes" });
        }
      } catch (err) {
        console.error("Permission check error:", err);
        res.status(500).json({ message: "Erro interno do servidor" });
      }
    };
  };
  
  // Authentication Routes
  router.post('/auth/login', (req, res, next) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Nome de usuário e senha são obrigatórios" });
    }
    
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Erro interno do servidor" });
      }
      
      if (!user) {
        return res.status(401).json({ message: info?.message || "Credenciais inválidas" });
      }
      
      req.login(user, (err) => {
        if (err) {
          console.error("Session error:", err);
          return res.status(500).json({ message: "Erro ao criar sessão" });
        }
        
        // Return safe user object (without password)
        res.json({
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role
        });
      });
    })(req, res, next);
  });
  
  router.get('/auth/me', requireAuth, (req, res) => {
    const user = req.user as User;
    
    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role
    });
  });
  
  router.post('/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  });
  
  // User Routes
  router.get('/users', requireAuth, requirePermission("team"), async (req, res) => {
    try {
      const users = await storage.listUsers();
      
      // Don't return password hashes
      const safeUsers = users.map(user => ({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }));
      
      res.json(safeUsers);
    } catch (err) {
      console.error("List users error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.post('/users', requireAuth, requirePermission("team"), validateRequest(insertUserSchema), async (req, res) => {
    try {
      const newUser = await storage.createUser(req.body);
      
      // Don't return password hash
      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status
      });
    } catch (err) {
      console.error("Create user error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Role Routes
  router.get('/roles', requireAuth, requirePermission("team"), async (req, res) => {
    try {
      const roles = await storage.listRoles();
      res.json(roles);
    } catch (err) {
      console.error("List roles error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.post('/roles', requireAuth, requirePermission("team"), validateRequest(insertRoleSchema), async (req, res) => {
    try {
      const newRole = await storage.createRole(req.body);
      res.status(201).json(newRole);
    } catch (err) {
      console.error("Create role error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Inventory Routes
  router.get('/inventory', requireAuth, async (req, res) => {
    try {
      const items = await storage.listInventoryItems();
      res.json(items);
    } catch (err) {
      console.error("List inventory error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.post('/inventory', requireAuth, requirePermission("inventory"), validateRequest(insertInventoryItemSchema), async (req, res) => {
    try {
      const newItem = await storage.createInventoryItem(req.body);
      res.status(201).json(newItem);
    } catch (err) {
      console.error("Create inventory item error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.patch('/inventory/:id', requireAuth, requirePermission("inventory"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const updatedItem = await storage.updateInventoryItem(id, req.body);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Item not found" });
      }
      
      res.json(updatedItem);
    } catch (err) {
      console.error("Update inventory item error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Shopping List Routes
  router.get('/shopping', requireAuth, async (req, res) => {
    try {
      const items = await storage.listShoppingItems();
      res.json(items);
    } catch (err) {
      console.error("List shopping items error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.post('/shopping', requireAuth, validateRequest(insertShoppingItemSchema), async (req, res) => {
    try {
      const newItem = await storage.createShoppingItem({
        ...req.body,
        createdBy: (req.user as User).id
      });
      res.status(201).json(newItem);
    } catch (err) {
      console.error("Create shopping item error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Inventory Count Routes
  router.post('/inventory/counts', requireAuth, requirePermission("inventory"), validateRequest(insertInventoryCountSchema), async (req, res) => {
    try {
      const newCount = await storage.createInventoryCount({
        ...req.body,
        userId: (req.user as User).id
      });
      res.status(201).json(newCount);
    } catch (err) {
      console.error("Create inventory count error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.get('/inventory/counts', requireAuth, async (req, res) => {
    try {
      const counts = await storage.listInventoryCounts();
      res.json(counts);
    } catch (err) {
      console.error("List inventory counts error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Task Routes
  router.get('/tasks', requireAuth, requirePermission("tasks"), async (req, res) => {
    try {
      const tasks = await storage.listTasks();
      res.json(tasks);
    } catch (err) {
      console.error("List tasks error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.post('/tasks', requireAuth, requirePermission("tasks"), validateRequest(insertTaskSchema), async (req, res) => {
    try {
      const newTask = await storage.createTask({
        ...req.body,
        createdBy: (req.user as User).id
      });
      res.status(201).json(newTask);
    } catch (err) {
      console.error("Create task error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.patch('/tasks/:id', requireAuth, requirePermission("tasks"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const updatedTask = await storage.updateTask(id, req.body);
      
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(updatedTask);
    } catch (err) {
      console.error("Update task error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Feedback Routes
  router.get('/feedback', requireAuth, async (req, res) => {
    try {
      const feedback = await storage.listFeedback();
      
      // Filter feedback based on visibility and user role
      const user = req.user as User;
      const filteredFeedback = feedback.filter(item => {
        if (item.visibility === "all") {
          return true;
        }
        return item.visibility === "admin" && user.role === "Admin";
      });
      
      res.json(filteredFeedback);
    } catch (err) {
      console.error("List feedback error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.post('/feedback', requireAuth, validateRequest(insertFeedbackSchema), async (req, res) => {
    try {
      const newFeedback = await storage.createFeedback({
        ...req.body,
        submittedBy: (req.user as User).id
      });
      res.status(201).json(newFeedback);
    } catch (err) {
      console.error("Create feedback error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.patch('/feedback/:id', requireAuth, requirePermission("feedback"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const updatedFeedback = await storage.updateFeedback(id, req.body);
      
      if (!updatedFeedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }
      
      res.json(updatedFeedback);
    } catch (err) {
      console.error("Update feedback error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Chat Routes
  router.get('/channels', requireAuth, requirePermission("chat"), async (req, res) => {
    try {
      const channels = await storage.listChannels();
      res.json(channels);
    } catch (err) {
      console.error("List channels error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.post('/channels', requireAuth, requirePermission("chat"), validateRequest(insertChannelSchema), async (req, res) => {
    try {
      const newChannel = await storage.createChannel({
        ...req.body,
        createdBy: (req.user as User).id
      });
      res.status(201).json(newChannel);
    } catch (err) {
      console.error("Create channel error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.get('/channels/:id/messages', requireAuth, requirePermission("chat"), async (req, res) => {
    try {
      const channelId = req.params.id;
      const messages = await storage.listMessages(channelId);
      res.json(messages);
    } catch (err) {
      console.error("List messages error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Notification Routes
  router.get('/notifications', requireAuth, async (req, res) => {
    try {
      const userId = (req.user as User).id;
      const notifications = await storage.listUserNotifications(userId);
      res.json(notifications);
    } catch (err) {
      console.error("List notifications error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.post('/notifications/read/:id', requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const updatedNotification = await storage.markNotificationRead(id);
      
      if (!updatedNotification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      res.json(updatedNotification);
    } catch (err) {
      console.error("Mark notification read error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // System Configuration Routes
  router.get('/config/:key', requireAuth, requirePermission("configuration"), async (req, res) => {
    try {
      const key = req.params.key;
      const config = await storage.getSystemConfig(key);
      
      if (!config) {
        return res.status(404).json({ message: "Configuration not found" });
      }
      
      res.json(config);
    } catch (err) {
      console.error("Get config error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.put('/config/:key', requireAuth, requirePermission("configuration"), async (req, res) => {
    try {
      const key = req.params.key;
      const { value } = req.body;
      
      if (!value) {
        return res.status(400).json({ message: "Value is required" });
      }
      
      const updatedConfig = await storage.setSystemConfig({
        key,
        value,
        updatedBy: (req.user as User).id
      });
      
      res.json(updatedConfig);
    } catch (err) {
      console.error("Update config error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.get('/config/:key/history', requireAuth, requirePermission("configuration"), async (req, res) => {
    try {
      const key = req.params.key;
      const history = await storage.listConfigHistory(key);
      res.json(history);
    } catch (err) {
      console.error("Get config history error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Module Routes
  router.get('/modules', requireAuth, async (req, res) => {
    try {
      const modules = await storage.listModules();
      res.json(modules);
    } catch (err) {
      console.error("List modules error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.post('/modules', requireAuth, requirePermission("configuration"), validateRequest(insertModuleSchema), async (req, res) => {
    try {
      const newModule = await storage.createModule({
        ...req.body,
        registeredBy: (req.user as User).id
      });
      res.status(201).json(newModule);
    } catch (err) {
      console.error("Create module error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.patch('/modules/:id', requireAuth, requirePermission("configuration"), async (req, res) => {
    try {
      const id = req.params.id;
      const updatedModule = await storage.updateModule(id, req.body);
      
      if (!updatedModule) {
        return res.status(404).json({ message: "Module not found" });
      }
      
      res.json(updatedModule);
    } catch (err) {
      console.error("Update module error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Dashboard data route (aggregated data for the dashboard)
  router.get('/dashboard', requireAuth, async (req, res) => {
    try {
      const users = await storage.listUsers();
      const tasks = await storage.listTasks();
      const inventory = await storage.listInventoryItems();
      
      // Calculate stats
      const teamMembers = users.length;
      const activeTasks = tasks.filter(task => task.status !== "completed").length;
      const lowStockItems = inventory.filter(item => item.quantity < item.minQuantity).length;
      
      // Get recent tasks
      const recentTasks = tasks
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 4);
      
      // Get inventory alerts
      const inventoryAlerts = inventory
        .filter(item => item.quantity < item.minQuantity)
        .slice(0, 4);
      
      res.json({
        stats: {
          teamMembers,
          activeTasks,
          inventoryAlerts: lowStockItems
        },
        tasks: recentTasks,
        inventory: inventoryAlerts
      });
    } catch (err) {
      console.error("Dashboard data error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Mount router
  app.use('/api', router);
  
  return httpServer;
}
