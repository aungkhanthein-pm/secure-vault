import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, longtext, boolean, bigint } from "drizzle-orm/mysql-core";

/**
 * Users table with email/password authentication (no OAuth).
 * Stores hashed passwords, TOTP secrets, and encryption metadata.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  name: text("name"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // TOTP 2FA fields
  totpSecret: varchar("totpSecret", { length: 64 }), // Base32-encoded secret
  totpEnabled: boolean("totpEnabled").default(false).notNull(),
  
  // Encryption metadata
  // Note: Master passphrase is NEVER stored. User enters it at login to derive encryption keys.
  // We store a hash of the passphrase for verification purposes only.
  passphraseHash: text("passphraseHash"), // Hash of master passphrase for verification
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * TOTP backup codes table.
 * Stores one-time backup codes for account recovery if authenticator is lost.
 */
export const totpBackupCodes = mysqlTable("totp_backup_codes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  code: varchar("code", { length: 20 }).notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TotpBackupCode = typeof totpBackupCodes.$inferSelect;
export type InsertTotpBackupCode = typeof totpBackupCodes.$inferInsert;

/**
 * Folders/categories for organizing documents.
 */
export const folders = mysqlTable("folders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 7 }), // Hex color for UI
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Folder = typeof folders.$inferSelect;
export type InsertFolder = typeof folders.$inferInsert;

/**
 * Files table with encryption metadata.
 * Stores encrypted file references, metadata, and encryption keys.
 * 
 * Security model:
 * - fileKey: Encrypted with user's derived encryption key (PBKDF2 from master passphrase)
 * - iv: Initialization vector for AES-GCM encryption
 * - The actual file bytes are stored separately (in server storage or S3)
 * - Client decrypts the fileKey, then uses it to decrypt the file bytes
 */
export const files = mysqlTable("files", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  folderId: int("folderId"), // Optional folder association
  
  // File metadata (stored in plaintext for search/display)
  name: varchar("name", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 100 }),
  sizeBytes: bigint("sizeBytes", { mode: "number" }).notNull(),
  
  // Encryption metadata
  // These are used by the client to decrypt the file
  encryptedFileKey: text("encryptedFileKey").notNull(), // Encrypted with user's master key
  iv: varchar("iv", { length: 32 }).notNull(), // Hex-encoded IV for AES-GCM
  
  // Storage reference
  storageKey: varchar("storageKey", { length: 512 }).notNull(), // Path/key in server storage
  
  // Metadata
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  deletedAt: timestamp("deletedAt"), // Soft delete support
});

export type File = typeof files.$inferSelect;
export type InsertFile = typeof files.$inferInsert;

/**
 * Session tokens for JWT-based authentication.
 * Stores refresh tokens for session management.
 */
export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  refreshToken: varchar("refreshToken", { length: 512 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;
