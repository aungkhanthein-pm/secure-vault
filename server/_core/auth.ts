import { SignJWT, jwtVerify } from "jose";
import bcryptjs from "bcryptjs";
import * as db from "../db";
import { ENV } from "./env";
import type { User } from "../../drizzle/schema";

const JWT_SECRET = new TextEncoder().encode(ENV.jwtSecret || "your-secret-key-change-in-production");

export interface JWTPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  sessionId: number;
  userId: number;
  iat: number;
  exp: number;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

/**
 * Generate JWT access token (short-lived, ~15 minutes)
 */
export async function generateAccessToken(userId: number, email: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 15 * 60; // 15 minutes

  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(now + expiresIn)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Generate refresh token (long-lived, ~7 days)
 * Returns both the token and the session ID for database tracking
 */
export async function generateRefreshToken(userId: number): Promise<{ token: string; sessionId: number }> {
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 7 * 24 * 60 * 60; // 7 days
  const expiresAt = new Date(Date.now() + expiresIn * 1000);

  // Generate a random refresh token
  const refreshToken = Buffer.from(Math.random().toString()).toString("base64").slice(0, 64);

  // Store in database
  const result = await db.createSession(userId, refreshToken, expiresAt);
  const sessionId = result.insertId;

  return { token: refreshToken, sessionId };
}

/**
 * Verify JWT access token
 */
export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as JWTPayload;
  } catch (error) {
    console.error("[Auth] JWT verification failed:", error);
    return null;
  }
}

/**
 * Verify refresh token against database
 */
export async function verifyRefreshToken(refreshToken: string): Promise<RefreshTokenPayload | null> {
  try {
    const session = await db.getSessionByRefreshToken(refreshToken);
    if (!session) {
      return null;
    }

    // Check if token has expired
    if (session.expiresAt < new Date()) {
      await db.deleteSession(session.id);
      return null;
    }

    return {
      sessionId: session.id,
      userId: session.userId,
      iat: Math.floor(session.createdAt.getTime() / 1000),
      exp: Math.floor(session.expiresAt.getTime() / 1000),
    };
  } catch (error) {
    console.error("[Auth] Refresh token verification failed:", error);
    return null;
  }
}

/**
 * Register a new user
 */
export async function registerUser(email: string, password: string, name?: string): Promise<User> {
  // Check if user already exists
  const existingUser = await db.getUserByEmail(email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  await db.createUser({
    email,
    passwordHash,
    name,
  });

  // Fetch and return the created user
  const user = await db.getUserByEmail(email);
  if (!user) {
    throw new Error("Failed to create user");
  }

  return user;
}

/**
 * Login user with email and password
 */
export async function loginUser(email: string, password: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  const user = await db.getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  // Update last signed in
  await db.updateUserLastSignedIn(user.id);

  // Generate tokens
  const accessToken = await generateAccessToken(user.id, user.email!);
  const { token: refreshToken } = await generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; user: User }> {
  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) {
    throw new Error("Invalid or expired refresh token");
  }

  const user = await db.getUserById(payload.userId);
  if (!user) {
    throw new Error("User not found");
  }

  const accessToken = await generateAccessToken(user.id, user.email!);

  return { accessToken, user };
}

/**
 * Hash a passphrase for verification (NOT for encryption key derivation)
 * This is used to verify that the user entered the correct master passphrase
 */
export async function hashPassphrase(passphrase: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(passphrase, salt);
}

/**
 * Verify passphrase
 */
export async function verifyPassphrase(passphrase: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(passphrase, hash);
}
