import { Router } from 'express';
import { login } from './auth.controller.js';

const r = Router();

// POST /auth/login  { email, password }  -> { token, user }
r.post('/login', login);

export default r;
