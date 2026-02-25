import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { prisma } from '../../config/db.js';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(req, res, next) {
  try {
    const body = bodySchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: body.email }});
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(body.password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (e) {
    return next(e);
  }
}
