import { Request, Response } from 'express';
import { statsService } from '../services/stats.service';

export const getServerStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await statsService.getServerStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching server stats:', error);
    res.status(500).json({
      message: 'Failed to fetch server statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
