import { Router } from 'express';
import { authRequired } from '../../middlewares/auth.js';
import {
  listNews, getNews, createNews, updateNews, deleteNews, addComment
} from './news.controller.js';

const r = Router();

r.get('/', listNews);
r.get('/:id', getNews);

r.post('/', authRequired, createNews);
r.patch('/:id', authRequired, updateNews);
r.delete('/:id', authRequired, deleteNews);

// Separate endpoint for comments (cleaner than PATCH-ing the whole array)
r.post('/:id/comments', authRequired, addComment);

export default r;
