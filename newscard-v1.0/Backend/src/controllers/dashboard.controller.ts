import { Request, Response } from 'express';
import dashboardService from '../services/dashboard.service';

export const fetchDashboardDetails = async (_req: Request, res: Response) => {
  try {
    const details = await dashboardService.fetchDashboardDetails();

    return res.status(201).json({
      success: '1',
      message: 'Successfully Fetched Dashboard details',
      data: details,
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(200).json({ success: '0', message: (err as Error).message });
  }
};
