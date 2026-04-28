import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import * as authService from "./auth";
import * as db from "../db";

const COOKIE_NAME = "auth_token";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Get JWT token from cookie or Authorization header
    const token = getAuthToken(opts.req);
    
    if (token) {
      const payload = await authService.verifyAccessToken(token);
      if (payload) {
        const dbUser = await db.getUserById(payload.userId);
        if (dbUser) {
          user = dbUser;
        }
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    console.error("[Auth] Context creation error:", error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}

/**
 * Extract JWT token from request (cookie or Authorization header)
 */
function getAuthToken(req: CreateExpressContextOptions["req"]): string | null {
  // Try Authorization header first (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  // Try cookie
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenMatch = cookies.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    if (tokenMatch) {
      return tokenMatch[1];
    }
  }

  return null;
}

export { COOKIE_NAME };
