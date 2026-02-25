import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear
  await prisma.comment.deleteMany();
  await prisma.news.deleteMany();
  await prisma.user.deleteMany();

  const pw = await bcrypt.hash('password123', 10);

  const users = await prisma.user.createMany({
    data: [
      { name: 'Alice Rahman', email: 'alice@example.com', password: pw },
      { name: 'Karim Hossain', email: 'karim@example.com', password: pw },
      { name: 'Nusrat Jahan', email: 'nusrat@example.com', password: pw },
    ]
  });

  const alice = await prisma.user.findUnique({ where: { email: 'alice@example.com' }});
  const karim = await prisma.user.findUnique({ where: { email: 'karim@example.com' }});
  const nusrat = await prisma.user.findUnique({ where: { email: 'nusrat@example.com' }});

  const n1 = await prisma.news.create({
    data: {
      title: 'Govt Announces New Tech Park',
      body: 'A new state-of-the-art tech park will be established in Dhaka to boost the IT sector.....',
      authorId: alice.id
    }
  });

  await prisma.comment.createMany({
    data: [
      { text: 'Great initiative!', newsId: n1.id, userId: karim.id },
      { text: 'Hope this brings more jobs.', newsId: n1.id, userId: nusrat.id },
    ]
  });

  await prisma.news.create({
    data: {
      title: 'Local Startup Wins Innovation Award',
      body: 'A Dhaka-based startup has won an international innovation award for AI-driven solutions...',
      authorId: karim.id
    }
  });

  console.log('Seed complete.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
