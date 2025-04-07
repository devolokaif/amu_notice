
import { AuthUser, UserRole } from "@/types/auth";

// Mock admin user with the requested password
export const ADMIN_USER: AuthUser = {
  id: "admin-1",
  email: "admin@school.edu",
  name: "Admin User",
  role: "admin" as UserRole,
  password: "hiss" 
};

// Mock teacher users
export const TEACHER_USERS: AuthUser[] = [
  {
    id: "teacher-1",
    email: "teacher1@school.edu",
    name: "Teacher One",
    role: "teacher" as UserRole,
    password: "password123"
  },
  {
    id: "teacher-2",
    email: "teacher2@school.edu", 
    name: "Teacher Two",
    role: "teacher" as UserRole,
    password: "password123"
  }
];

// Mock student users
export const STUDENT_USERS: AuthUser[] = [
  {
    id: "student-1",
    email: "student1@school.edu",
    name: "Student One",
    role: "student" as UserRole,
    password: "password123"
  },
  {
    id: "student-2",
    email: "student2@school.edu",
    name: "Student Two",
    role: "student" as UserRole,
    password: "password123"
  }
];

// All mock users
export const MOCK_USERS: AuthUser[] = [ADMIN_USER, ...TEACHER_USERS, ...STUDENT_USERS];
