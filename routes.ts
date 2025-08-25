import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTransactionSchema, insertWatchHistorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Auth routes
  app.post("/api/auth/first-login-bonus", async (req, res) => {
    try {
      const { firebaseUid, email, name } = req.body;
      
      if (!firebaseUid || !email || !name) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if user exists
      let user = await storage.getUserByFirebaseUid(firebaseUid);
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          firebaseUid,
          email,
          name,
          role: 'USER',
          walletBalancePaise: 0,
          bonusCredited: false,
          streakCount: 0,
        });
      }

      // Credit welcome bonus if not already credited
      if (!user.bonusCredited) {
        const welcomeBonus = parseInt(process.env.WELCOME_BONUS_PAISE || '50000');
        
        // Update user balance and bonus status
        user = await storage.updateUser(user.id, {
          walletBalancePaise: user.walletBalancePaise + welcomeBonus,
          bonusCredited: true,
          lastLoginAt: new Date(),
        });

        // Create transaction record
        await storage.createTransaction({
          userId: user.id,
          amountPaise: welcomeBonus,
          type: 'BONUS',
          note: 'Welcome bonus credited',
          status: 'COMPLETED',
        });
      } else {
        // Just update last login
        user = await storage.updateUser(user.id, {
          lastLoginAt: new Date(),
        });
      }

      res.json({ user, bonusApplied: !user.bonusCredited });
    } catch (error) {
      console.error('First login bonus error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Content routes
  app.get("/api/content", async (req, res) => {
    try {
      const allContent = await storage.getAllContent();
      res.json(allContent);
    } catch (error) {
      console.error('Get content error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/content/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const contentItem = await storage.getContentBySlug(slug);
      
      if (!contentItem) {
        return res.status(404).json({ message: "Content not found" });
      }

      res.json(contentItem);
    } catch (error) {
      console.error('Get content by slug error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Watch history routes
  app.post("/api/watch-history", async (req, res) => {
    try {
      const watchHistoryData = insertWatchHistorySchema.parse(req.body);
      const history = await storage.upsertWatchHistory(watchHistoryData);
      res.json(history);
    } catch (error) {
      console.error('Update watch history error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/:userId/watch-history", async (req, res) => {
    try {
      const { userId } = req.params;
      const history = await storage.getWatchHistory(userId);
      res.json(history);
    } catch (error) {
      console.error('Get watch history error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Wallet routes
  app.get("/api/users/:userId/transactions", async (req, res) => {
    try {
      const { userId } = req.params;
      const transactions = await storage.getTransactions(userId);
      res.json(transactions);
    } catch (error) {
      console.error('Get transactions error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Ad routes
  app.get("/api/ads/:placement", async (req, res) => {
    try {
      const { placement } = req.params;
      const ads = await storage.getAdsByPlacement(placement);
      res.json(ads);
    } catch (error) {
      console.error('Get ads error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/ads/:id/click", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.incrementAdClick(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Ad click error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Certificate routes
  app.get("/api/users/:userId/certificates", async (req, res) => {
    try {
      const { userId } = req.params;
      const certificates = await storage.getCertificates(userId);
      res.json(certificates);
    } catch (error) {
      console.error('Get certificates error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/certificates/verify", async (req, res) => {
    try {
      const { certNo } = req.query;
      
      if (!certNo || typeof certNo !== 'string') {
        return res.status(400).json({ message: "Certificate number required" });
      }

      const certificate = await storage.getCertificateByCertNo(certNo);
      
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }

      res.json(certificate);
    } catch (error) {
      console.error('Verify certificate error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin routes
  app.get("/api/admin/content", async (req, res) => {
    try {
      // TODO: Add admin role validation
      const allContent = await storage.getAllContent();
      res.json(allContent);
    } catch (error) {
      console.error('Admin get content error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/ads", async (req, res) => {
    try {
      // TODO: Add admin role validation
      const allAds = await storage.getAllAds();
      res.json(allAds);
    } catch (error) {
      console.error('Admin get ads error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
