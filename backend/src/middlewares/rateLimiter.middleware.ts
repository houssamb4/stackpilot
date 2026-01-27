import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  blockedUntil?: number;
}

// Store rate limit data in memory (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const MAX_ATTEMPTS = 5; // Maximum failed attempts
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes block

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    // Remove entries older than window time and not blocked
    if (!entry.blockedUntil && now - entry.firstAttempt > WINDOW_MS) {
      rateLimitStore.delete(key);
    }
    // Remove entries that are no longer blocked
    if (entry.blockedUntil && now > entry.blockedUntil) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Get client IP address from request
 */
const getClientIp = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
};

/**
 * Rate limiting middleware for login attempts
 */
export const loginRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = getClientIp(req);
  const now = Date.now();
  
  // Get or create rate limit entry for this IP
  let entry = rateLimitStore.get(ip);
  
  if (!entry) {
    entry = {
      attempts: 0,
      firstAttempt: now,
    };
    rateLimitStore.set(ip, entry);
  }
  
  // Check if IP is currently blocked
  if (entry.blockedUntil && now < entry.blockedUntil) {
    const remainingTime = Math.ceil((entry.blockedUntil - now) / 1000 / 60);
    logger.warn(`Blocked login attempt from IP: ${ip} - ${remainingTime} minutes remaining`);
    return res.status(429).json({
      message: `Too many failed login attempts. Please try again in ${remainingTime} minutes.`,
      blockedUntil: entry.blockedUntil,
    });
  }
  
  // Reset if window has expired
  if (now - entry.firstAttempt > WINDOW_MS) {
    entry.attempts = 0;
    entry.firstAttempt = now;
    delete entry.blockedUntil;
  }
  
  // Check if max attempts reached
  if (entry.attempts >= MAX_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_DURATION_MS;
    logger.warn(`IP ${ip} has been blocked for ${BLOCK_DURATION_MS / 1000 / 60} minutes after ${MAX_ATTEMPTS} failed attempts`);
    return res.status(429).json({
      message: `Too many failed login attempts. Your IP has been blocked for ${BLOCK_DURATION_MS / 1000 / 60} minutes.`,
      blockedUntil: entry.blockedUntil,
    });
  }
  
  // Attach rate limit info to request for use in auth controller
  (req as any).rateLimitEntry = entry;
  (req as any).clientIp = ip;
  
  next();
};

/**
 * Record failed login attempt
 */
export const recordFailedAttempt = (req: Request) => {
  const entry = (req as any).rateLimitEntry as RateLimitEntry;
  const ip = (req as any).clientIp as string;
  
  if (entry) {
    entry.attempts++;
    const remainingAttempts = MAX_ATTEMPTS - entry.attempts;
    
    logger.warn(`Failed login attempt from IP: ${ip} - ${remainingAttempts} attempts remaining`);
    
    if (remainingAttempts <= 0) {
      entry.blockedUntil = Date.now() + BLOCK_DURATION_MS;
      logger.error(`IP ${ip} has been blocked after ${MAX_ATTEMPTS} failed attempts`);
    }
  }
};

/**
 * Clear rate limit for successful login
 */
export const clearRateLimit = (req: Request) => {
  const ip = (req as any).clientIp as string;
  if (ip) {
    rateLimitStore.delete(ip);
    logger.info(`Rate limit cleared for IP: ${ip} after successful login`);
  }
};

/**
 * Get rate limit stats (for monitoring)
 */
export const getRateLimitStats = () => {
  return {
    totalTrackedIps: rateLimitStore.size,
    blockedIps: Array.from(rateLimitStore.entries())
      .filter(([_, entry]) => entry.blockedUntil && Date.now() < entry.blockedUntil)
      .map(([ip, entry]) => ({
        ip,
        attempts: entry.attempts,
        blockedUntil: entry.blockedUntil,
      })),
  };
};
