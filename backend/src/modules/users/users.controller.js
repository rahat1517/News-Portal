import { prisma } from '../../config/db.js';

export async function listUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true }
    });
    res.json(users);
  } catch (e) { next(e); }
}

export async function getUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, createdAt: true }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (e) { next(e); }
}
