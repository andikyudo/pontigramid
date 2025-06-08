import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import {
  verifyPassword,
  createSession,
  validateLoginCredentials,
  checkRateLimit,
  recordLoginAttempt,
  verifyCSRFToken
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { username, password, csrfToken } = body;

    // CSRF protection
    if (!csrfToken || !(await verifyCSRFToken(csrfToken))) {
      return NextResponse.json(
        { success: false, error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }

    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown';

    // Check rate limiting
    const rateLimit = checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
      recordLoginAttempt(clientIP, false);
      return NextResponse.json(
        {
          success: false,
          error: 'Too many login attempts. Please try again in 15 minutes.',
          remainingAttempts: 0
        },
        { status: 429 }
      );
    }

    // Validate input
    const validation = validateLoginCredentials({ username, password });
    if (!validation.valid) {
      recordLoginAttempt(clientIP, false);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: validation.errors,
          remainingAttempts: rateLimit.remainingAttempts
        },
        { status: 400 }
      );
    }

    // Find user by username or email
    const identifier = username.trim().toLowerCase();
    const user = await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier }
      ],
      isActive: true
    });

    if (!user) {
      recordLoginAttempt(clientIP, false);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials',
          remainingAttempts: rateLimit.remainingAttempts - 1
        },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      recordLoginAttempt(clientIP, false);
      return NextResponse.json(
        {
          success: false,
          error: 'Account is temporarily locked. Please try again later.',
          remainingAttempts: 0
        },
        { status: 423 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      // Increment login attempts
      user.loginAttempts += 1;

      // Lock account after 5 failed attempts
      if (user.loginAttempts >= 5) {
        user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }

      await user.save();
      recordLoginAttempt(clientIP, false);

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials',
          remainingAttempts: Math.max(0, rateLimit.remainingAttempts - 1)
        },
        { status: 401 }
      );
    }

    // Check if user has admin role
    if (!['admin', 'super_admin'].includes(user.role)) {
      recordLoginAttempt(clientIP, false);
      return NextResponse.json(
        {
          success: false,
          error: 'Access denied. Admin privileges required.',
          remainingAttempts: rateLimit.remainingAttempts - 1
        },
        { status: 403 }
      );
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockoutUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    // Create session
    const adminUser = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role as 'admin' | 'super_admin',
      createdAt: user.createdAt
    };

    await createSession(adminUser);
    recordLoginAttempt(clientIP, true);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
