import { Request, Response } from 'express';
import { emitSocketEvent } from '../socket';
import wsService from '../services/ws.service';

export const getCurrencyFeed = async (req: Request, res: Response) => {
  try {
    // get currency data from ws service
    const currencyData = await wsService.getCurrencyDetails();

    // Emit the currencyData using emitSocketEvent
    setInterval(() => {
      emitSocketEvent(req, currencyData);
    }, 10000); // 10000 milliseconds (10 seconds)

    return res.status(200).json({
      success: '1',
      message: 'Successfully emitted currency details',
    });
  } catch (err) {
    console.log((err as Error).message);
    res.status(500).json({ success: '0', message: (err as Error).message });
  }
};
