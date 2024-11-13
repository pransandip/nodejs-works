import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { Server, Socket } from 'socket.io';
import WebSocket from 'ws';
import http from 'http';
import config from './config/default';
import { userRouter } from './routes/user.routes';
import { currencyRouter } from './routes/currency.routes';
import { otpRouter } from './routes/otp.routes';

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
dotenv.config();
const PORT = config.port || process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRouter);
app.use('/api/currency', currencyRouter);
app.use('/api/otp', otpRouter);

// WebSocket connection listener
io.on('connection', (socket: Socket) => {
  console.log('user is connected');

  // Handle incoming currency stream from user
  socket.on('subscribe', (currency: string) => {
    const streamUrl = `wss://stream.binance.com:9443/ws/${currency.toLowerCase()}usdt@trade`;

    // create a WebSocket connection to the Binance stream
    const binance = new WebSocket(streamUrl);
    binance.onopen = () => {
      console.log(`connected to binance stream: ${streamUrl}`);

      // forwarding binance stream messages to the client
      binance.onmessage = (message: WebSocket.MessageEvent) => {
        socket.emit('message', message.data);
      };
    };

    // WebSocket connection closed
    binance.onclose = () => {
      console.log(`disconnected from binance stream: ${streamUrl}`);
    };

    // clean up WebSocket connection when the Socket.IO client disconnects
    socket.on('disconnect', () => {
      console.log('user disconnected');
      binance.close();
    });
  });
});

// Welcome Screen
app.get('/', (_req: Request, res: Response) => res.sendStatus(200));

server.listen(PORT, () => {
  console.log(`BitzUp: server is running on port http://localhost:${PORT}`);
});
