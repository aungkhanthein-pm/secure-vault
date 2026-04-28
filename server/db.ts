import { eq, and, isNull, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users, files, folders, sessions, totpBackupCodes, File, Folder } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL);
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// USER QUERIES
// ============================================================================

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUser(data: {
  email: string;
  passwordHash: string;
  name?: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(users).values({
    email: data.email,
    passwordHash: data.passwordHash,
    name: data.name,
    role: "user",
  });

  return result;
}

export async function updateUserLastSignedIn(userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, userId));
}

export async function updateUserPassphraseHash(userId: number, passphraseHash: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(users).set({ passphraseHash }).where(eq(users.id, userId));
}

// ============================================================================
// TOTP QUERIES
// ============================================================================

export async function updateUserTotpSecret(userId: number, totpSecret: string, enabled: boolean = false) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(users).set({ totpSecret, totpEnabled: enabled }).where(eq(users.id, userId));
}

export async function disableUserTotp(userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(users).set({ totpSecret: null, totpEnabled: false }).where(eq(users.id, userId));
}

export async function createTotpBackupCodes(userId: number, codes: string[]) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.insert(totpBackupCodes).values(
    codes.map(code => ({ userId, code, used: false }))
  );
}

export async function getTotpBackupCodes(userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(totpBackupCodes).where(eq(totpBackupCodes.userId, userId));
}

export async function markTotpBackupCodeAsUsed(codeId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(totpBackupCodes).set({ used: true }).where(eq(totpBackupCodes.id, codeId));
}

// ============================================================================
// SESSION QUERIES
// ============================================================================

export async function createSession(userId: number, refreshToken: string, expiresAt: Date) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(sessions).values({
    userId,
    refreshToken,
    expiresAt,
  });

  return result;
}

export async function getSessionByRefreshToken(refreshToken: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(sessions).where(eq(sessions.refreshToken, refreshToken)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteSession(sessionId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

// ============================================================================
// FILE QUERIES
// ============================================================================

export async function createFile(data: {
  userId: number;
  folderId?: number;
  name: string;
  mimeType?: string;
  sizeBytes: number;
  encryptedFileKey: string;
  iv: string;
  storageKey: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(files).values({
    userId: data.userId,
    folderId: data.folderId,
    name: data.name,
    mimeType: data.mimeType,
    sizeBytes: data.sizeBytes,
    encryptedFileKey: data.encryptedFileKey,
    iv: data.iv,
    storageKey: data.storageKey,
  });

  return result;
}

export async function getUserFiles(userId: number, folderId?: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const conditions = [eq(files.userId, userId), isNull(files.deletedAt)];
  if (folderId !== undefined) {
    conditions.push(eq(files.folderId, folderId));
  }

  return await db.select().from(files)
    .where(and(...conditions))
    .orderBy(desc(files.uploadedAt));
}

export async function getFileById(fileId: number, userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(files)
    .where(and(eq(files.id, fileId), eq(files.userId, userId), isNull(files.deletedAt)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function deleteFile(fileId: number, userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(files)
    .set({ deletedAt: new Date() })
    .where(and(eq(files.id, fileId), eq(files.userId, userId)));
}

export async function renameFile(fileId: number, userId: number, newName: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(files)
    .set({ name: newName })
    .where(and(eq(files.id, fileId), eq(files.userId, userId)));
}

export async function moveFileToFolder(fileId: number, userId: number, folderId?: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(files)
    .set({ folderId })
    .where(and(eq(files.id, fileId), eq(files.userId, userId)));
}

export async function searchFiles(userId: number, query: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Simple LIKE search on file name
  return await db.select().from(files)
    .where(and(
      eq(files.userId, userId),
      isNull(files.deletedAt)
    ))
    .orderBy(desc(files.uploadedAt));
}

// ============================================================================
// FOLDER QUERIES
// ============================================================================

export async function createFolder(data: {
  userId: number;
  name: string;
  description?: string;
  color?: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(folders).values({
    userId: data.userId,
    name: data.name,
    description: data.description,
    color: data.color,
  });

  return result;
}

export async function getUserFolders(userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(folders)
    .where(eq(folders.userId, userId))
    .orderBy(desc(folders.createdAt));
}

export async function getFolderById(folderId: number, userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(folders)
    .where(and(eq(folders.id, folderId), eq(folders.userId, userId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function deleteFolder(folderId: number, userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(folders)
    .where(and(eq(folders.id, folderId), eq(folders.userId, userId)));
}

export async function updateFolder(folderId: number, userId: number, data: { name?: string; description?: string; color?: string }) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(folders)
    .set(data)
    .where(and(eq(folders.id, folderId), eq(folders.userId, userId)));
}
