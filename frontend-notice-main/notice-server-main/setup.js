
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found. Please create one with your database connection string.');
  process.exit(1);
}

// Run database migrations and seed
try {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('🔄 Running Prisma migrations...');
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  
  console.log('🌱 Seeding database...');
  execSync('npx prisma db seed', { stdio: 'inherit' });
  
  console.log('✅ Setup completed successfully!');
  console.log('\nYou can now start the server with:');
  console.log('  npm run dev');
  console.log('\nAdmin credentials:');
  console.log('  Email: admin@school.edu');
  console.log('  Password: hiss');
} catch (error) {
  console.error('❌ Setup failed:', error.message);
}
