import { z } from 'zod';
import { prisma } from '../../config/db.js';

// Validation rules (same as assignment)
const createSchema = z.object({
  title: z.string().trim().min(1, 'News title cannot be empty.'),
  body: z.string().trim().min(20, 'News body must be at least 20 characters.'),
});

const updateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  body: z.string().trim().min(20).optional(),
}).refine(v => Object.keys(v).length > 0, { message: 'No fields to update' });

const commentSchema = z.object({
  text: z.string().trim().min(1, 'Comment text cannot be empty.'),
});

export async function listNews(req, res, next) {
  try {
    const news = await prisma.news.findMany({
      include: {
        author: { select: { id: true, name: true, email: true } },
        comments: { include: { user: { select: { id: true, name: true } } }, orderBy: { createdAt: 'asc' } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // If you want the same shape as JSON-server, you can map it. Here we return richer data.
    res.json(news);
  } catch (e) { next(e); }
}

export async function getNews(req, res, next) {
  try {
    const id = Number(req.params.id);
    const news = await prisma.news.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        comments: { include: { user: { select: { id: true, name: true } } }, orderBy: { createdAt: 'asc' } }
      }
    });
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json(news);
  } catch (e) { next(e); }
}

export async function createNews(req, res, next) {
  try {
    const body = createSchema.parse(req.body);
    const authorId = Number(req.user.sub);

    const created = await prisma.news.create({
      data: { ...body, authorId },
      include: { author: { select: { id: true, name: true } } }
    });

    res.status(201).json(created);
  } catch (e) { next(e); }
}

export async function updateNews(req, res, next) {
  try {
    const id = Number(req.params.id);
    const patch = updateSchema.parse(req.body);

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'News not found' });

    const me = Number(req.user.sub);
    if (existing.authorId !== me) return res.status(403).json({ message: 'You cannot edit news written by another user.' });

    const updated = await prisma.news.update({
      where: { id },
      data: patch
    });

    res.json(updated);
  } catch (e) { next(e); }
}

export async function deleteNews(req, res, next) {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'News not found' });

    const me = Number(req.user.sub);
    if (existing.authorId !== me) return res.status(403).json({ message: 'You cannot delete news written by another user.' });

    await prisma.news.delete({ where: { id } });
    res.status(204).send();
  } catch (e) { next(e); }
}

export async function addComment(req, res, next) {
  try {
    const id = Number(req.params.id);
    const body = commentSchema.parse(req.body);
    const userId = Number(req.user.sub);

    const existing = await prisma.news.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: 'News not found' });

    const created = await prisma.comment.create({
      data: { text: body.text, newsId: id, userId },
      include: { user: { select: { id: true, name: true } } }
    });

    res.status(201).json(created);
  } catch (e) { next(e); }
}
