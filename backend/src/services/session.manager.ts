import { logger } from '../config/logger';

interface ActiveSession {
  userId: string;
  lastActivity: number;
  userAgent: string;
  ip: string;
}

class SessionManager {
  private activeSessions = new Map<string, ActiveSession>();
  private readonly SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes
  private readonly CLEANUP_INTERVAL = 60 * 1000; // 1 minute
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanup();
  }

  /**
   * Track user activity
   */
  trackActivity(userId: string, token: string, ip: string, userAgent: string) {
    const session: ActiveSession = {
      userId,
      lastActivity: Date.now(),
      userAgent,
      ip,
    };
    
    const wasInactive = this.activeSessions.size === 0;
    this.activeSessions.set(token, session);
    
    if (wasInactive) {
      logger.info('First session activated - system waking up');
    }
  }

  /**
   * Remove session
   */
  removeSession(token: string) {
    this.activeSessions.delete(token);
    
    if (this.activeSessions.size === 0) {
      logger.info('All sessions ended - system entering idle mode');
    }
  }

  /**
   * Check if there are active sessions
   */
  hasActiveSessions(): boolean {
    return this.activeSessions.size > 0;
  }

  /**
   * Get number of active sessions
   */
  getActiveSessionCount(): number {
    return this.activeSessions.size;
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): ActiveSession[] {
    return Array.from(this.activeSessions.values());
  }

  /**
   * Start automatic cleanup of expired sessions
   */
  private startCleanup() {
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      let removedCount = 0;

      for (const [token, session] of this.activeSessions.entries()) {
        if (now - session.lastActivity > this.SESSION_TIMEOUT) {
          this.activeSessions.delete(token);
          removedCount++;
        }
      }

      if (removedCount > 0) {
        logger.info(`Cleaned up ${removedCount} expired session(s). Active sessions: ${this.activeSessions.size}`);
      }

      // Log idle state
      if (this.activeSessions.size === 0) {
        logger.info('System idle - no active sessions');
      }
    }, this.CLEANUP_INTERVAL);
  }

  /**
   * Stop cleanup timer
   */
  stop() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Get session statistics
   */
  getStats() {
    return {
      activeSessions: this.activeSessions.size,
      isIdle: this.activeSessions.size === 0,
      sessions: this.getActiveSessions().map(s => ({
        userId: s.userId,
        lastActivity: new Date(s.lastActivity).toISOString(),
        idleTime: Date.now() - s.lastActivity,
        ip: s.ip,
      })),
    };
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();
