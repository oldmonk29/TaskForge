import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum('user_role', ['USER', 'ADMIN']);
export const transactionTypeEnum = pgEnum('transaction_type', ['BONUS', 'PURCHASE', 'TOPUP', 'REWARD', 'REFUND']);
export const transactionStatusEnum = pgEnum('transaction_status', ['PENDING', 'COMPLETED', 'FAILED']);
export const purchaseSkuEnum = pgEnum('purchase_sku', ['FREEMIUM', 'PREMIUM', 'ADVISORY']);
export const adPlacementEnum = pgEnum('ad_placement', ['below_description', 'banner']);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firebaseUid: text("firebase_uid").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: userRoleEnum("role").default('USER').notNull(),
  walletBalancePaise: integer("wallet_balance_paise").default(0).notNull(),
  bonusCredited: boolean("bonus_credited").default(false).notNull(),
  streakCount: integer("streak_count").default(0).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Content table
export const content = pgTable("content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  bannerUrl: text("banner_url"),
  videoUrl: text("video_url").notNull(),
  isPremium: boolean("is_premium").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  duration: integer("duration_seconds"),
  instructorName: text("instructor_name"),
  instructorImage: text("instructor_image"),
  viewCount: integer("view_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Watch History table
export const watchHistory = pgTable("watch_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  contentId: varchar("content_id").references(() => content.id, { onDelete: 'cascade' }).notNull(),
  positionSeconds: integer("position_seconds").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  amountPaise: integer("amount_paise").notNull(),
  type: transactionTypeEnum("type").notNull(),
  note: text("note"),
  status: transactionStatusEnum("status").default('COMPLETED').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Purchases table
export const purchases = pgTable("purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  sku: purchaseSkuEnum("sku").notNull(),
  amountPaise: integer("amount_paise").notNull(),
  status: transactionStatusEnum("status").default('PENDING').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Certificates table
export const certificates = pgTable("certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  contentId: varchar("content_id").references(() => content.id, { onDelete: 'cascade' }).notNull(),
  certNo: text("cert_no").notNull().unique(),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  pdfUrl: text("pdf_url"),
});

// Ads table
export const ads = pgTable("ads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  placement: adPlacementEnum("placement").notNull(),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  active: boolean("active").default(true).notNull(),
  weight: integer("weight").default(1).notNull(),
  clickCount: integer("click_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Referrals table
export const referrals = pgTable("referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerUserId: varchar("referrer_user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  refereeUserId: varchar("referee_user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  bonusPaise: integer("bonus_paise").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Labs table (Phase 5)
export const labs = pgTable("labs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  difficulty: text("difficulty").notNull(),
  instructionsMd: text("instructions_md").notNull(),
  repoUrl: text("repo_url"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  watchHistory: many(watchHistory),
  transactions: many(transactions),
  purchases: many(purchases),
  certificates: many(certificates),
  referralsAsReferrer: many(referrals, { relationName: "referrer" }),
  referralsAsReferee: many(referrals, { relationName: "referee" }),
}));

export const contentRelations = relations(content, ({ many }) => ({
  watchHistory: many(watchHistory),
  certificates: many(certificates),
}));

export const watchHistoryRelations = relations(watchHistory, ({ one }) => ({
  user: one(users, {
    fields: [watchHistory.userId],
    references: [users.id],
  }),
  content: one(content, {
    fields: [watchHistory.contentId],
    references: [content.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, {
    fields: [purchases.userId],
    references: [users.id],
  }),
}));

export const certificatesRelations = relations(certificates, ({ one }) => ({
  user: one(users, {
    fields: [certificates.userId],
    references: [users.id],
  }),
  content: one(content, {
    fields: [certificates.contentId],
    references: [content.id],
  }),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerUserId],
    references: [users.id],
    relationName: "referrer",
  }),
  referee: one(users, {
    fields: [referrals.refereeUserId],
    references: [users.id],
    relationName: "referee",
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
  createdAt: true,
});

export const insertWatchHistorySchema = createInsertSchema(watchHistory).omit({
  id: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertPurchaseSchema = createInsertSchema(purchases).omit({
  id: true,
  createdAt: true,
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
  issuedAt: true,
});

export const insertAdSchema = createInsertSchema(ads).omit({
  id: true,
  createdAt: true,
  clickCount: true,
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
});

export const insertLabSchema = createInsertSchema(labs).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Content = typeof content.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;
export type WatchHistory = typeof watchHistory.$inferSelect;
export type InsertWatchHistory = z.infer<typeof insertWatchHistorySchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Ad = typeof ads.$inferSelect;
export type InsertAd = z.infer<typeof insertAdSchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Lab = typeof labs.$inferSelect;
export type InsertLab = z.infer<typeof insertLabSchema>;
