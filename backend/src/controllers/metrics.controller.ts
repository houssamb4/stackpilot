import { Request, Response } from 'express';
import si from 'systeminformation';
import os from 'os';
import FastSpeedtest from 'fast-speedtest-api';

export const getCpuMetrics = async (req: Request, res: Response) => {
  try {
    const load = await si.currentLoad();
    const cpus = os.cpus();
    
    res.json({
      cpuUsage: Math.round(load.currentLoad * 10) / 10,
      cores: cpus.length,
      model: cpus[0]?.model || 'Unknown',
      perCore: load.cpus.map((cpu, index) => ({
        core: index,
        load: Math.round(cpu.load * 10) / 10,
      })),
    });
  } catch (error) {
    console.error('Failed to get CPU metrics:', error);
    res.status(500).json({ error: 'Failed to retrieve CPU metrics' });
  }
};

export const getMemoryMetrics = async (req: Request, res: Response) => {
  try {
    const mem = await si.mem();
    
    res.json({
      total: Math.round(mem.total / (1024 * 1024 * 1024) * 10) / 10, // GB
      used: Math.round(mem.used / (1024 * 1024 * 1024) * 10) / 10, // GB
      free: Math.round(mem.free / (1024 * 1024 * 1024) * 10) / 10, // GB
      usedPercent: Math.round((mem.used / mem.total) * 100 * 10) / 10,
      available: Math.round(mem.available / (1024 * 1024 * 1024) * 10) / 10, // GB
    });
  } catch (error) {
    console.error('Failed to get memory metrics:', error);
    res.status(500).json({ error: 'Failed to retrieve memory metrics' });
  }
};

export const getDiskMetrics = async (req: Request, res: Response) => {
  try {
    const fsSize = await si.fsSize();
    
    const disks = fsSize.map(disk => ({
      fs: disk.fs,
      type: disk.type,
      size: Math.round(disk.size / (1024 * 1024 * 1024)), // GB
      used: Math.round(disk.used / (1024 * 1024 * 1024)), // GB
      available: Math.round((disk.size - disk.used) / (1024 * 1024 * 1024)), // GB
      usedPercent: Math.round(disk.use * 10) / 10,
      mount: disk.mount,
    }));
    
    res.json({ disks });
  } catch (error) {
    console.error('Failed to get disk metrics:', error);
    res.status(500).json({ error: 'Failed to retrieve disk metrics' });
  }
};

export const getNetworkMetrics = async (req: Request, res: Response) => {
  try {
    const networkStats = await si.networkStats();
    
    const interfaces = networkStats.map(iface => ({
      interface: iface.iface,
      rx_sec: Math.round(iface.rx_sec / 1024), // KB/s
      tx_sec: Math.round(iface.tx_sec / 1024), // KB/s
      rx_bytes: Math.round(iface.rx_bytes / (1024 * 1024)), // MB
      tx_bytes: Math.round(iface.tx_bytes / (1024 * 1024)), // MB
    }));
    
    res.json({ interfaces });
  } catch (error) {
    console.error('Failed to get network metrics:', error);
    res.status(500).json({ error: 'Failed to retrieve network metrics' });
  }
};

export const getNetworkInterfaces = async (req: Request, res: Response) => {
  try {
    const networkInterfaces = await si.networkInterfaces();
    
    const interfaces = networkInterfaces.map(iface => ({
      iface: iface.iface,
      ifaceName: iface.ifaceName,
      ip4: iface.ip4,
      ip6: iface.ip6,
      mac: iface.mac,
      internal: iface.internal,
      virtual: iface.virtual,
      operstate: iface.operstate,
      type: iface.type,
      speed: iface.speed,
    }));
    
    res.json({ interfaces });
  } catch (error) {
    console.error('Failed to get network interfaces:', error);
    res.status(500).json({ error: 'Failed to retrieve network interfaces' });
  }
};

export const testNetworkSpeed = async (req: Request, res: Response) => {
  try {
    const speedtest = new FastSpeedtest({
      token: 'YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm', // Default token
      verbose: false,
      timeout: 10000,
      https: true,
      urlCount: 5,
      bufferSize: 8,
      unit: FastSpeedtest.UNITS.Mbps
    });

    const downloadSpeed = await speedtest.getSpeed();
    
    res.json({
      download: Math.round(downloadSpeed * 100) / 100,
      upload: Math.round(downloadSpeed * 0.1 * 100) / 100, // Estimate upload as 10% of download
      unit: 'Mbps',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to test network speed:', error);
    res.status(500).json({ error: 'Failed to test network speed' });
  }
};

export const getSystemLogs = async (req: Request, res: Response) => {
  try {
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);

    // For Windows: Get important Application and System event logs
    const command = `powershell -Command "Get-EventLog -LogName Application,System -Newest 50 -EntryType Error,Warning,Information | Select-Object -First 50 | Select-Object TimeGenerated,EntryType,Source,Message | ConvertTo-Json"`;
    
    const { stdout } = await execPromise(command);
    const logs = JSON.parse(stdout);
    
    const formattedLogs = Array.isArray(logs) ? logs.map((log: any) => ({
      timestamp: log.TimeGenerated,
      level: log.EntryType === 0 ? 'ERROR' : log.EntryType === 1 ? 'WARNING' : 'INFO',
      source: log.Source,
      message: log.Message ? log.Message.substring(0, 200) : 'No message',
    })) : [];

    res.json({ logs: formattedLogs });
  } catch (error) {
    console.error('Failed to get system logs:', error);
    res.status(500).json({ error: 'Failed to retrieve system logs' });
  }
};
