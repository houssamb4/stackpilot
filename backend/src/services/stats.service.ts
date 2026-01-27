import os from 'os';
import checkDiskSpace from 'check-disk-space';

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

  private getCpuInfo(): CpuInfo {
    const cpus = os.cpus();
    
    // Calculate average CPU usage
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((cpu) => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type as keyof typeof cpu.times];
      }
      totalIdle += cpu.times.idle;
    });

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usage = 100 - Math.round((100 * idle) / total);

    return {
      usage,
      cores: cpus.length,
      model: cpus[0]?.model || 'Unknown',
    };
  }

  private async getDiskInfo(): Promise<DiskInfo> {
    try {
      // Check root drive (C: on Windows, / on Unix)
      const diskPath = process.platform === 'win32' ? 'C:' : '/';
      const diskSpace = await checkDiskSpace(diskPath);

      const total = diskSpace.size;
      const free = diskSpace.free;
      const used = total - free;

      return {
        total: Math.round(total / (1024 * 1024 * 1024)), // GB
        used: Math.round(used / (1024 * 1024 * 1024)), // GB
        free: Math.round(free / (1024 * 1024 * 1024)), // GB
        usedPercent: Math.round((used / total) * 100),
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
      Promise.resolve(this.getCpuInfo()),
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
