import express from 'express';
import cors from 'cors';

import { notFound, errorHandler } from './middlewares/errors.js';
import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import newsRoutes from './modules/news/news.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/news', newsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
