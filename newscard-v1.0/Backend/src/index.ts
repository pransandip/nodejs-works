import ConnectMongoDBSession from 'connect-mongodb-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import session from 'express-session';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import config from './config/default';
import { SESSION_LIFETIME } from './helpers/constants';
import { cardRouter } from './routes/card.routes';
import { chatRouter } from './routes/chat.routes';
import { dashboardRouter } from './routes/dashboard.routes';
import { otpRouter } from './routes/otp.routes';
import { postRouter } from './routes/post.routes';
import { quizRouter } from './routes/quiz.routes';
import { userRouter } from './routes/user.routes';
import { initializeSocketIO } from './socket';

const app: Express = express();
const server = http.createServer(app);
export const io: Server = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
dotenv.config();
const PORT = config.PORT || process.env.PORT;
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
initializeSocketIO(io);
app.use('/user', userRouter);
app.use('/otp', otpRouter);
app.use('/card', cardRouter);
app.use('/post', postRouter);
app.use('/quiz', quizRouter);
app.use('/dashboard', dashboardRouter);
app.use('/chat', chatRouter);

/*---- Welcome Screen ----*/
app.get('/', (_req: Request, res: Response) => res.sendStatus(200));

server.listen(PORT, () => {
  console.log(`⚙️  News card: server is running on port ${config.BASE_URL}`);
});
