import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { audienceAuthentication } from './utils/middleware/auth/jwtAuthentication'
//TODO remove health check to eliminate chance of BACK DOOR RAMMING
//TODO add access token expiration date
// TODO Add Cors to middle ware
import webinarRouter from './routers/webinars/webinarRouter'
import healthCheckRouter from './routers/healthChecks/healthChecksRouter';
import registerAccountRouter from './routers/auth/registerAccountRouter';
import jwtAuthRouter from './routers/auth/jwtAuthRouter';
import filter from 'content-filter';
import videoRouter from './routers/videos/videosRouter';
import loggerMiddleware from './logging/loggerMiddleware'


const limit = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests'
});

const app = express();
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(filter())
//app.use(loggerMiddleware)
app.use('/health-check', limit, healthCheckRouter);
app.use('/webinars', limit, webinarRouter);
app.use('/auth', limit, jwtAuthRouter);
app.use('/register', limit, registerAccountRouter);
app.use('/video', limit, videoRouter);

export default app;