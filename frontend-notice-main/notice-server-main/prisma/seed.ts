
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Check if admin exists
  const adminExists = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!adminExists) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('hiss', salt);
    
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@school.edu',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    
    console.log('Admin user created:', admin.email);
    
    // Create some teachers
    const teacher1 = await prisma.user.create({
      data: {
        name: 'Teacher One',
        email: 'teacher1@school.edu',
        password: await bcrypt.hash('password123', salt),
        role: 'TEACHER',
      },
    });
    
    const teacher2 = await prisma.user.create({
      data: {
        name: 'Teacher Two',
        email: 'teacher2@school.edu',
        password: await bcrypt.hash('password123', salt),
        role: 'TEACHER',
      },
    });
    
    // Create some students
    await prisma.user.create({
      data: {
        name: 'Student One',
        email: 'student1@school.edu',
        password: await bcrypt.hash('password123', salt),
        role: 'STUDENT',
      },
    });
    
    await prisma.user.create({
      data: {
        name: 'Student Two',
        email: 'student2@school.edu',
        password: await bcrypt.hash('password123', salt),
        role: 'STUDENT',
      },
    });
    
    // Create some initial notices
    const now = new Date();
    
    await prisma.notice.create({
      data: {
        title: 'Mid-Term Exams',
        content: 'Mid-term examinations will be conducted from October. Please prepare accordingly.',
        priority: 'HIGH',
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        expiresAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        authorId: teacher1.id,
      },
    });
    
    await prisma.notice.create({
      data: {
        title: 'Science Fair',
        content: 'Annual science fair will be held next month. Students interested in participating should contact their science teacher.',
        priority: 'MEDIUM',
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        authorId: teacher2.id,
      },
    });
    
    await prisma.notice.create({
      data: {
        title: 'Holiday Announcement',
        content: 'School will remain closed on 15th August for Independence Day.',
        priority: 'LOW',
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        authorId: teacher1.id,
      },
    });
    
    console.log('Seed data created successfully');
  } else {
    console.log('Admin user already exists, skipping seed');
  }
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
