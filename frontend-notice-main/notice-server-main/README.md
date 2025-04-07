
# Class Notice Board - Server

This is the backend server for the Class Notice Board application.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure your database connection in the `.env` file:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/class_notice_board?schema=public"
   ```

3. Run database migrations:
   ```
   npx prisma migrate dev --name init
   ```

4. Seed admin user (in development):
   ```
   curl -X POST http://localhost:5000/api/users/seed-admin
   ```
   This will create an admin user with email `admin@school.edu` and password `hiss`.

5. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login a user

### Notices
- GET `/api/notices` - Get all notices
- POST `/api/notices` - Create a new notice (teachers and admins only)
- DELETE `/api/notices/:id` - Delete a notice (owner or admin only)

### Users
- GET `/api/users` - Get all users (admin only)
- POST `/api/users` - Create a new user (admin only)
- POST `/api/users/seed-admin` - Seed admin user (development only)
