import express, { Express, Request, Response } from 'express';
import path from 'path';
import http from 'http';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { Server } from 'socket.io';
import { initializeSocketIO } from './socket';
import config from './config/default';
import { userRouter } from './routes/user.routes';
import { currencyRouter } from './routes/currency.routes';
import { otpRouter } from './routes/otp.routes';
import { wsRouter } from './routes/ws.routes';

const app: Express = express();
const server = http.createServer(app);
export const io: Server = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

dotenv.config();
const PORT = config.port || process.env.PORT;

app.set('trust proxy', true);
app.set('io', io);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user', userRouter);
app.use('/api/otp', otpRouter);
app.use('/api/currency', currencyRouter);
app.use('/api/ws', wsRouter);

initializeSocketIO(io);

// Welcome Screen
app.get('/', (_req: Request, res: Response) => res.sendStatus(200));

server.listen(PORT, () => {
  console.log(`⚙️  BitzUp: server is running on port ${config.BASE_URL}`);
});
