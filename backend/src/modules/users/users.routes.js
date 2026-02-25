import { Router } from 'express';
import { listUsers, getUser } from './users.controller.js';
import { authRequired } from '../../middlewares/auth.js';

const r = Router();

// In real apps, you might protect these. For class/demo, list is public:
r.get('/', listUsers);
r.get('/:id', getUser);

export default r;
