import express, { Express } from 'express';
import config from 'config';
import connectDB from './db/db.connect';
import logger from './utils/logger';
import routes from './routes/routes';

const port = config.get<number>('port');
const app: Express = express();

app.listen(port, async () => {
  logger.info(`TS: server is running on port http://localhost:${port}`);
  await connectDB();
  routes(app);
});
