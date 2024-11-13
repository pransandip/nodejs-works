import express from 'express';
import { fetchDashboardDetails } from '../controllers/dashboard.controller';
const router = express.Router();

router.route('/fetch-details').get(fetchDashboardDetails);

export { router as dashboardRouter };