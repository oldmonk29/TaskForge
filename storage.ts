import { 
  users, content, watchHistory, transactions, purchases, certificates, ads, referrals, labs,
  type User, type InsertUser, type Content, type InsertContent, 
  type WatchHistory, type InsertWatchHistory, type Transaction, type InsertTransaction,
  type Purchase, type InsertPurchase, type Certificate, type InsertCertificate,
  type Ad, type InsertAd, type Referral, type InsertReferral, type Lab, type InsertLab
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User>;
  
  // Content methods
  getAllContent(): Promise<Content[]>;
  getContentBySlug(slug: string): Promise<Content | undefined>;
  getContentByCategory(category: string): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: string, updates: Partial<InsertContent>): Promise<Content>;
  
  // Watch history methods
  getWatchHistory(userId: string): Promise<WatchHistory[]>;
  getWatchHistoryByContent(userId: string, contentId: string): Promise<WatchHistory | undefined>;
  upsertWatchHistory(watchHistory: InsertWatchHistory): Promise<WatchHistory>;
  
  // Transaction methods
  getTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Purchase methods
  getPurchases(userId: string): Promise<Purchase[]>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  
  // Certificate methods
  getCertificates(userId: string): Promise<Certificate[]>;
  getCertificateByCertNo(certNo: string): Promise<Certificate | undefined>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  
  // Ad methods
  getAdsByPlacement(placement: string): Promise<Ad[]>;
  getAllAds(): Promise<Ad[]>;
  createAd(ad: InsertAd): Promise<Ad>;
  updateAd(id: string, updates: Partial<InsertAd>): Promise<Ad>;
  incrementAdClick(id: string): Promise<void>;
  
  // Referral methods
  getReferrals(userId: string): Promise<Referral[]>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  
  // Lab methods
  getAllLabs(): Promise<Lab[]>;
  createLab(lab: InsertLab): Promise<Lab>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  // Content methods
  async getAllContent(): Promise<Content[]> {
    return await db.select().from(content).where(eq(content.isActive, true)).orderBy(desc(content.createdAt));
  }

  async getContentBySlug(slug: string): Promise<Content | undefined> {
    const [contentItem] = await db.select().from(content).where(and(eq(content.slug, slug), eq(content.isActive, true)));
    return contentItem || undefined;
  }

  async getContentByCategory(category: string): Promise<Content[]> {
    return await db.select().from(content).where(and(eq(content.category, category), eq(content.isActive, true)));
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const [contentItem] = await db.insert(content).values(insertContent).returning();
    return contentItem;
  }

  async updateContent(id: string, updates: Partial<InsertContent>): Promise<Content> {
    const [contentItem] = await db.update(content).set(updates).where(eq(content.id, id)).returning();
    return contentItem;
  }

  // Watch history methods
  async getWatchHistory(userId: string): Promise<WatchHistory[]> {
    return await db.select().from(watchHistory).where(eq(watchHistory.userId, userId)).orderBy(desc(watchHistory.updatedAt));
  }

  async getWatchHistoryByContent(userId: string, contentId: string): Promise<WatchHistory | undefined> {
    const [history] = await db.select().from(watchHistory).where(and(eq(watchHistory.userId, userId), eq(watchHistory.contentId, contentId)));
    return history || undefined;
  }

  async upsertWatchHistory(insertWatchHistory: InsertWatchHistory): Promise<WatchHistory> {
    const existing = await this.getWatchHistoryByContent(insertWatchHistory.userId, insertWatchHistory.contentId);
    
    if (existing) {
      const [updated] = await db.update(watchHistory)
        .set({ positionSeconds: insertWatchHistory.positionSeconds, updatedAt: new Date() })
        .where(eq(watchHistory.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(watchHistory).values(insertWatchHistory).returning();
      return created;
    }
  }

  // Transaction methods
  async getTransactions(userId: string): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt));
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db.insert(transactions).values(insertTransaction).returning();
    return transaction;
  }

  // Purchase methods
  async getPurchases(userId: string): Promise<Purchase[]> {
    return await db.select().from(purchases).where(eq(purchases.userId, userId)).orderBy(desc(purchases.createdAt));
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const [purchase] = await db.insert(purchases).values(insertPurchase).returning();
    return purchase;
  }

  // Certificate methods
  async getCertificates(userId: string): Promise<Certificate[]> {
    return await db.select().from(certificates).where(eq(certificates.userId, userId)).orderBy(desc(certificates.issuedAt));
  }

  async getCertificateByCertNo(certNo: string): Promise<Certificate | undefined> {
    const [certificate] = await db.select().from(certificates).where(eq(certificates.certNo, certNo));
    return certificate || undefined;
  }

  async createCertificate(insertCertificate: InsertCertificate): Promise<Certificate> {
    const [certificate] = await db.insert(certificates).values(insertCertificate).returning();
    return certificate;
  }

  // Ad methods
  async getAdsByPlacement(placement: string): Promise<Ad[]> {
    return await db.select().from(ads).where(and(eq(ads.placement, placement as any), eq(ads.active, true)));
  }

  async getAllAds(): Promise<Ad[]> {
    return await db.select().from(ads).orderBy(desc(ads.createdAt));
  }

  async createAd(insertAd: InsertAd): Promise<Ad> {
    const [ad] = await db.insert(ads).values(insertAd).returning();
    return ad;
  }

  async updateAd(id: string, updates: Partial<InsertAd>): Promise<Ad> {
    const [ad] = await db.update(ads).set(updates).where(eq(ads.id, id)).returning();
    return ad;
  }

  async incrementAdClick(id: string): Promise<void> {
    const { sql } = await import('drizzle-orm');
    await db.update(ads).set({ clickCount: sql`click_count + 1` }).where(eq(ads.id, id));
  }

  // Referral methods
  async getReferrals(userId: string): Promise<Referral[]> {
    return await db.select().from(referrals).where(eq(referrals.referrerUserId, userId)).orderBy(desc(referrals.createdAt));
  }

  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const [referral] = await db.insert(referrals).values(insertReferral).returning();
    return referral;
  }

  // Lab methods
  async getAllLabs(): Promise<Lab[]> {
    return await db.select().from(labs).where(eq(labs.active, true));
  }

  async createLab(insertLab: InsertLab): Promise<Lab> {
    const [lab] = await db.insert(labs).values(insertLab).returning();
    return lab;
  }
}

export const storage = new DatabaseStorage();
