import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import si from 'systeminformation';

const execAsync = promisify(exec);

interface MemoryInfo {
  total: number;
  used: number;
  free: number;
  usedPercent: number;
}

interface CpuInfo {
  usage: number;
  cores: number;
  model: string;
}

interface DiskInfo {
  total: number;
  used: number;
  free: number;
  usedPercent: number;
}

interface LoadInfo {
  one: number;
  five: number;
  fifteen: number;
}

interface ServerStats {
  timestamp: string;
  cpu: CpuInfo;
  memory: MemoryInfo;
  disk: DiskInfo;
  load: LoadInfo;
  uptimeSeconds: number;
  platform: string;
  hostname: string;
}

export class StatsService {
  private getMemoryInfo(): MemoryInfo {
    const total = os.totalmem(); // bytes
    const free = os.freemem(); // bytes
    const used = total - free;

    return {
      total: Math.round(total / (1024 * 1024 * 1024)), // GB
      used: Math.round(used / (1024 * 1024 * 1024)), // GB
      free: Math.round(free / (1024 * 1024 * 1024)), // GB
      usedPercent: Math.round((used / total) * 100),
    };
  }

  private async getCpuInfo(): Promise<CpuInfo> {
    const cpus = os.cpus();
    const load = await si.currentLoad();
    
    return {
      usage: Math.round(load.currentLoad * 10) / 10, // Round to 1 decimal
      cores: cpus.length,
      model: cpus[0]?.model || 'Unknown',
    };
  }

  private async getDiskInfo(): Promise<DiskInfo> {
    try {
      const fsSize = await si.fsSize();
      
      if (fsSize.length === 0) {
        throw new Error('No disk information available');
      }

      // Get the main drive (C: on Windows, / on Linux)
      const mainDrive = fsSize[0];
      
      return {
        total: Math.round(mainDrive.size / (1024 * 1024 * 1024)), // GB
        used: Math.round(mainDrive.used / (1024 * 1024 * 1024)), // GB
        free: Math.round((mainDrive.size - mainDrive.used) / (1024 * 1024 * 1024)), // GB
        usedPercent: Math.round(mainDrive.use), // Already in percentage
      };
    } catch (error) {
      console.error('Failed to get disk info:', error);
      return {
        total: 0,
        used: 0,
        free: 0,
        usedPercent: 0,
      };
    }
  }

  private getLoadInfo(): LoadInfo {
    const [one, five, fifteen] = os.loadavg();
    return {
      one: Math.round(one * 100) / 100,
      five: Math.round(five * 100) / 100,
      fifteen: Math.round(fifteen * 100) / 100,
    };
  }

  async getServerStats(): Promise<ServerStats> {
    const [memory, cpu, disk, load] = await Promise.all([
      Promise.resolve(this.getMemoryInfo()),
      this.getCpuInfo(), // Now properly awaits async CPU calculation
      this.getDiskInfo(),
      Promise.resolve(this.getLoadInfo()),
    ]);

    return {
      timestamp: new Date().toISOString(),
      cpu,
      memory,
      disk,
      load,
      uptimeSeconds: Math.round(os.uptime()),
      platform: os.platform(),
      hostname: os.hostname(),
    };
  }
}

export const statsService = new StatsService();
