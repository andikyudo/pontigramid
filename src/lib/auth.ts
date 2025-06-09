import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Types
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
  createdAt: Date;
  lastLogin?: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthSession {
  user: AdminUser;
  expires: Date;
}

// Configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
);
const JWT_EXPIRES_IN = '7d';
const COOKIE_NAME = 'admin-session';

// Password hashing utilities
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// JWT utilities
export async function createToken(user: AdminUser): Promise<string> {
  const payload = {
    sub: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
  };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AdminUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    return {
      id: payload.sub as string,
      username: payload.username as string,
      email: payload.email as string,
      role: payload.role as 'admin' | 'super_admin',
      createdAt: new Date(),
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Session management
export async function createSession(user: AdminUser): Promise<void> {
  const token = await createToken(user);
  const cookieStore = await cookies();
  
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function getSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    
    if (!token) {
      return null;
    }
    
    return await verifyToken(token);
  } catch (error) {
    console.error('Session retrieval failed:', error);
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Rate limiting utilities
const loginAttempts = new Map<string, { count: number; lastAttempt: Date }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(identifier: string): { allowed: boolean; remainingAttempts: number } {
  const now = new Date();
  const attempts = loginAttempts.get(identifier);
  
  if (!attempts) {
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - 1 };
  }
  
  // Reset if lockout period has passed
  if (now.getTime() - attempts.lastAttempt.getTime() > LOCKOUT_DURATION) {
    loginAttempts.delete(identifier);
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - 1 };
  }
  
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    return { allowed: false, remainingAttempts: 0 };
  }
  
  return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - attempts.count - 1 };
}

export function recordLoginAttempt(identifier: string, success: boolean): void {
  const now = new Date();
  
  if (success) {
    loginAttempts.delete(identifier);
    return;
  }
  
  const attempts = loginAttempts.get(identifier);
  if (attempts) {
    attempts.count += 1;
    attempts.lastAttempt = now;
  } else {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now });
  }
}

// Input validation
export function validateLoginCredentials(credentials: LoginCredentials): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!credentials.username || credentials.username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  if (!credentials.password || credentials.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  // Sanitize username
  const sanitizedUsername = credentials.username.trim().toLowerCase();
  if (!/^[a-zA-Z0-9_]+$/.test(sanitizedUsername)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// CSRF protection
export function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function setCSRFToken(): Promise<string> {
  const token = generateCSRFToken();
  const cookieStore = await cookies();
  
  cookieStore.set('csrf-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });
  
  return token;
}

export async function verifyCSRFToken(token: string): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const storedToken = cookieStore.get('csrf-token')?.value;
    return storedToken === token;
  } catch (error) {
    console.error('CSRF verification failed:', error);
    return false;
  }
}

// Verify authentication for API routes
export async function verifyAuth(request: Request): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return { success: false, error: 'No authentication token found' };
    }

    const user = await verifyToken(token);

    if (!user) {
      return { success: false, error: 'Invalid authentication token' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Error verifying authentication:', error);
    return { success: false, error: 'Authentication verification failed' };
  }
}
