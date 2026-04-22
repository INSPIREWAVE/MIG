import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { db } from './db/adapter';
import { errorHandler } from './middleware/error.middleware';

import authRoutes from './routes/auth.routes';
import clientsRoutes from './routes/clients.routes';
import loansRoutes from './routes/loans.routes';
import paymentsRoutes from './routes/payments.routes';
import penaltiesRoutes from './routes/penalties.routes';
import collateralRoutes from './routes/collateral.routes';
import accountsRoutes from './routes/accounts.routes';
import documentsRoutes from './routes/documents.routes';
import auditRoutes from './routes/audit.routes';
import reportsRoutes from './routes/reports.routes';
import backupsRoutes from './routes/backups.routes';
import settingsRoutes from './routes/settings.routes';
import usersRoutes from './routes/users.routes';
import syncRoutes from './routes/sync.routes';

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);
const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'migl360.db');

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/loans', loansRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/penalties', penaltiesRoutes);
app.use('/api/collateral', collateralRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/backups', backupsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/sync', syncRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

async function bootstrap() {
  try {
    await db.init(path.dirname(DB_PATH));
    console.log(`[DB] Initialized at ${DB_PATH}`);
    app.listen(PORT, () => {
      console.log(`[Server] Running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
    });
  } catch (err) {
    console.error('[Server] Failed to start:', err);
    process.exit(1);
  }
}

bootstrap();

export default app;
