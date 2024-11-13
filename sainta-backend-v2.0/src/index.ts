import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import ConnectMongoDBSession from 'connect-mongodb-session';

import config from './config/default';
import { userRouter } from './routes/user.routes';
import { SESSION_LIFETIME } from './helpers/constants';
import { customerRouter } from './routes/customer.routes';

const app: Express = express();
const server = http.createServer(app);
const io: Server = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

dotenv.config();
const MongoDBStore = ConnectMongoDBSession(session);
const store = new MongoDBStore({
  uri: config.MONGO_URL,
  collection: 'Session',
});

app.set('trust proxy', true);
app.set('io', io);
app.use(
  cors({
    origin: config.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'HEAD', 'DELETE'],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: config.SESSION_NAME,
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: SESSION_LIFETIME(),
      secure: config.IN_PROD,
      sameSite: false,
    },
    store,
  }),
);
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/user', userRouter);
app.use('/customer', customerRouter);

// welcome screen
app.get('/', (_req: Request, res: Response) => res.sendStatus(200));

server.listen(config.PORT, () => {
  console.log(`⚙️  SAINTA: server is running on port ${config.BASE_URL}`);
});
