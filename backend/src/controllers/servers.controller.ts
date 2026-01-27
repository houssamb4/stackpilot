import { Request, Response } from 'express';
import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface Server extends RowDataPacket {
  id: number;
  name: string;
  type: string;
  host: string;
  port: number;
  description: string;
  status: string;
  started_at: Date;
  created_at: Date;
  updated_at: Date;
}

export const getAllServers = async (req: Request, res: Response) => {
  try {
    const [servers] = await pool.query<Server[]>(
      'SELECT * FROM servers ORDER BY created_at DESC'
    );
    
    // Calculate uptime for each server
    const serversWithUptime = servers.map(server => {
      const startedAt = new Date(server.started_at).getTime();
      const now = Date.now();
      const uptimeSeconds = Math.floor((now - startedAt) / 1000);
      
      return {
        ...server,
        uptimeSeconds,
      };
    });
    
    res.json({ servers: serversWithUptime });
  } catch (error) {
    console.error('Failed to get servers:', error);
    res.status(500).json({ error: 'Failed to retrieve servers' });
  }
};

export const getServer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [servers] = await pool.query<Server[]>(
      'SELECT * FROM servers WHERE id = ?',
      [id]
    );
    
    if (servers.length === 0) {
      return res.status(404).json({ error: 'Server not found' });
    }
    
    const server = servers[0];
    const startedAt = new Date(server.started_at).getTime();
    const now = Date.now();
    const uptimeSeconds = Math.floor((now - startedAt) / 1000);
    
    res.json({ 
      server: {
        ...server,
        uptimeSeconds,
      }
    });
  } catch (error) {
    console.error('Failed to get server:', error);
    res.status(500).json({ error: 'Failed to retrieve server' });
  }
};

export const createServer = async (req: Request, res: Response) => {
  try {
    const { name, type, host, port, description } = req.body;
    const userId = (req as any).user?.id;

    if (!name || !host || !port) {
      return res.status(400).json({ error: 'Name, host, and port are required' });
    }

    // Validate port number
    const portNum = parseInt(port);
    if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
      return res.status(400).json({ error: 'Port must be between 1 and 65535' });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO servers (name, type, host, port, description, created_by, started_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [name, type || 'custom', host, portNum, description || null, userId]
    );

    res.status(201).json({ 
      message: 'Server created successfully',
      serverId: result.insertId 
    });
  } catch (error) {
    console.error('Failed to create server:', error);
    res.status(500).json({ error: 'Failed to create server' });
  }
};

export const updateServer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type, host, port, description, status } = req.body;

    // Validate port if provided
    if (port) {
      const portNum = parseInt(port);
      if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
        return res.status(400).json({ error: 'Port must be between 1 and 65535' });
      }
    }

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE servers SET name = ?, type = ?, host = ?, port = ?, description = ?, status = ? WHERE id = ?',
      [name, type, host, port, description, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Server not found' });
    }

    res.json({ message: 'Server updated successfully' });
  } catch (error) {
    console.error('Failed to update server:', error);
    res.status(500).json({ error: 'Failed to update server' });
  }
};

export const deleteServer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM servers WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Server not found' });
    }

    res.json({ message: 'Server deleted successfully' });
  } catch (error) {
    console.error('Failed to delete server:', error);
    res.status(500).json({ error: 'Failed to delete server' });
  }
};

export const restartServerUptime = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE servers SET started_at = NOW() WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Server not found' });
    }

    res.json({ message: 'Server uptime restarted successfully' });
  } catch (error) {
    console.error('Failed to restart server uptime:', error);
    res.status(500).json({ error: 'Failed to restart server uptime' });
  }
};
