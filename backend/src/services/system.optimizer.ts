import { logger } from '../config/logger';
import { sessionManager } from './session.manager';

interface OptimizedTask {
  name: string;
  interval: number;
  task: () => Promise<void> | void;
  timer: NodeJS.Timeout | null;
}

class SystemOptimizer {
  private tasks: Map<string, OptimizedTask> = new Map();
  private checkInterval: NodeJS.Timeout | null = null;
  private isSystemActive = false;
  private readonly CHECK_INTERVAL = 5000; // Check every 5 seconds

  constructor() {
    this.startMonitoring();
  }

  /**
   * Register a task that should only run when sessions are active
   */
  registerTask(name: string, interval: number, task: () => Promise<void> | void) {
    const optimizedTask: OptimizedTask = {
      name,
      interval,
      task,
      timer: null,
    };

    this.tasks.set(name, optimizedTask);
    logger.info(`Registered optimized task: ${name} (interval: ${interval}ms)`);

    // Start immediately if system is active
    if (this.isSystemActive) {
      this.startTask(optimizedTask);
    }
  }

  /**
   * Start monitoring session activity
   */
  private startMonitoring() {
    this.checkInterval = setInterval(() => {
      const hasActiveSessions = sessionManager.hasActiveSessions();
      
      if (hasActiveSessions && !this.isSystemActive) {
        this.activateSystem();
      } else if (!hasActiveSessions && this.isSystemActive) {
        this.deactivateSystem();
      }
    }, this.CHECK_INTERVAL);

    logger.info('System optimizer started - monitoring session activity');
  }

  /**
   * Activate system - start all tasks
   */
  private activateSystem() {
    this.isSystemActive = true;
    logger.info('🚀 System activated - starting all background tasks');

    for (const task of this.tasks.values()) {
      this.startTask(task);
    }
  }

  /**
   * Deactivate system - stop all tasks to save resources
   */
  private deactivateSystem() {
    this.isSystemActive = false;
    logger.info('💤 System entering idle mode - stopping background tasks to save resources');

    for (const task of this.tasks.values()) {
      this.stopTask(task);
    }
  }

  /**
   * Start a specific task
   */
  private startTask(task: OptimizedTask) {
    if (task.timer) return; // Already running

    // Run immediately
    this.runTask(task);

    // Schedule periodic execution
    task.timer = setInterval(() => {
      this.runTask(task);
    }, task.interval);

    logger.info(`✅ Started task: ${task.name}`);
  }

  /**
   * Stop a specific task
   */
  private stopTask(task: OptimizedTask) {
    if (task.timer) {
      clearInterval(task.timer);
      task.timer = null;
      logger.info(`⏸️  Stopped task: ${task.name}`);
    }
  }

  /**
   * Run task with error handling
   */
  private async runTask(task: OptimizedTask) {
    try {
      await task.task();
    } catch (error) {
      logger.error(`Error running task ${task.name}:`, error);
    }
  }

  /**
   * Force activate system (for testing or manual override)
   */
  forceActivate() {
    this.activateSystem();
  }

  /**
   * Force deactivate system
   */
  forceDeactivate() {
    this.deactivateSystem();
  }

  /**
   * Get system status
   */
  getStatus() {
    return {
      isActive: this.isSystemActive,
      activeSessions: sessionManager.getActiveSessionCount(),
      registeredTasks: Array.from(this.tasks.keys()),
      runningTasks: Array.from(this.tasks.values())
        .filter(t => t.timer !== null)
        .map(t => t.name),
    };
  }

  /**
   * Stop optimizer
   */
  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    for (const task of this.tasks.values()) {
      this.stopTask(task);
    }

    logger.info('System optimizer stopped');
  }
}

// Export singleton instance
export const systemOptimizer = new SystemOptimizer();
