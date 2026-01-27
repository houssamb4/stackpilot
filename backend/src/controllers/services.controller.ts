import { Request, Response } from 'express';
import { pool } from '../config/database';
import { spawn, ChildProcess } from 'child_process';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

// Store active processes in memory
const activeProcesses = new Map<number, ChildProcess>();

interface Service extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  executable_path: string;
  arguments: string;
  working_directory: string;
  status: string;
  pid: number;
  last_started_at: Date;
  last_stopped_at: Date;
}

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const [services] = await pool.query<Service[]>(
      'SELECT * FROM services ORDER BY created_at DESC'
    );
    res.json({ services });
  } catch (error) {
    console.error('Failed to get services:', error);
    res.status(500).json({ error: 'Failed to retrieve services' });
  }
};

export const getService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [services] = await pool.query<Service[]>(
      'SELECT * FROM services WHERE id = ?',
      [id]
    );
    
    if (services.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json({ service: services[0] });
  } catch (error) {
    console.error('Failed to get service:', error);
    res.status(500).json({ error: 'Failed to retrieve service' });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const { name, description, executable_path, arguments: args, working_directory } = req.body;
    const userId = (req as any).user?.id;

    if (!name || !executable_path) {
      return res.status(400).json({ error: 'Name and executable path are required' });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO services (name, description, executable_path, arguments, working_directory, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description || null, executable_path, args || null, working_directory || null, userId]
    );

    res.status(201).json({ 
      message: 'Service created successfully',
      serviceId: result.insertId 
    });
  } catch (error) {
    console.error('Failed to create service:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, executable_path, arguments: args, working_directory } = req.body;

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE services SET name = ?, description = ?, executable_path = ?, arguments = ?, working_directory = ? WHERE id = ?',
      [name, description, executable_path, args, working_directory, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    console.error('Failed to update service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const serviceId = parseInt(id);

    // Stop service if running
    if (activeProcesses.has(serviceId)) {
      const process = activeProcesses.get(serviceId);
      process?.kill();
      activeProcesses.delete(serviceId);
    }

    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM services WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Failed to delete service:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
};

export const startService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const serviceId = parseInt(id);

    const [services] = await pool.query<Service[]>(
      'SELECT * FROM services WHERE id = ?',
      [id]
    );

    if (services.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const service = services[0];

    // Check if already running
    if (activeProcesses.has(serviceId)) {
      return res.status(400).json({ error: 'Service is already running' });
    }

    // Clear old logs
    await pool.query('DELETE FROM service_logs WHERE service_id = ?', [id]);

    // Parse arguments
    const args = service.arguments ? service.arguments.split(' ').filter(arg => arg.trim()) : [];
    const workingDir = service.working_directory || undefined;

    // Start the process
    const childProcess = spawn(service.executable_path, args, {
      cwd: workingDir,
      shell: true,
    });

    // Store process
    activeProcesses.set(serviceId, childProcess);

    // Update service status
    await pool.query(
      'UPDATE services SET status = ?, pid = ?, last_started_at = NOW() WHERE id = ?',
      ['running', childProcess.pid, id]
    );

    // Log system message
    await pool.query(
      'INSERT INTO service_logs (service_id, log_type, message) VALUES (?, ?, ?)',
      [id, 'system', `Service started with PID ${childProcess.pid}`]
    );

    // Handle stdout
    childProcess.stdout?.on('data', async (data) => {
      const message = data.toString();
      await pool.query(
        'INSERT INTO service_logs (service_id, log_type, message) VALUES (?, ?, ?)',
        [id, 'stdout', message]
      );
    });

    // Handle stderr
    childProcess.stderr?.on('data', async (data) => {
      const message = data.toString();
      await pool.query(
        'INSERT INTO service_logs (service_id, log_type, message) VALUES (?, ?, ?)',
        [id, 'stderr', message]
      );
    });

    // Handle process exit
    childProcess.on('exit', async (code) => {
      activeProcesses.delete(serviceId);
      const status = code === 0 ? 'stopped' : 'failed';
      await pool.query(
        'UPDATE services SET status = ?, pid = NULL, last_stopped_at = NOW() WHERE id = ?',
        [status, id]
      );
      await pool.query(
        'INSERT INTO service_logs (service_id, log_type, message) VALUES (?, ?, ?)',
        [id, 'system', `Service stopped with exit code ${code}`]
      );
    });

    res.json({ 
      message: 'Service started successfully',
      pid: childProcess.pid 
    });
  } catch (error) {
    console.error('Failed to start service:', error);
    res.status(500).json({ error: 'Failed to start service' });
  }
};

export const stopService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const serviceId = parseInt(id);

    if (!activeProcesses.has(serviceId)) {
      return res.status(400).json({ error: 'Service is not running' });
    }

    const process = activeProcesses.get(serviceId);
    process?.kill();
    activeProcesses.delete(serviceId);

    await pool.query(
      'UPDATE services SET status = ?, pid = NULL, last_stopped_at = NOW() WHERE id = ?',
      ['stopped', id]
    );

    await pool.query(
      'INSERT INTO service_logs (service_id, log_type, message) VALUES (?, ?, ?)',
      [id, 'system', 'Service manually stopped']
    );

    res.json({ message: 'Service stopped successfully' });
  } catch (error) {
    console.error('Failed to stop service:', error);
    res.status(500).json({ error: 'Failed to stop service' });
  }
};

export const getServiceLogs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 100;

    const [logs] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM service_logs WHERE service_id = ? ORDER BY timestamp DESC LIMIT ?',
      [id, limit]
    );

    res.json({ logs: logs.reverse() });
  } catch (error) {
    console.error('Failed to get service logs:', error);
    res.status(500).json({ error: 'Failed to retrieve service logs' });
  }
};
