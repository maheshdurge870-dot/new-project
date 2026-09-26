-- CampusEvent Supabase SQL Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables and types if you are re-running the script
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS volunteer_assignments CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS venues CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Enum for User Roles
CREATE TYPE user_role AS ENUM ('ADMIN', 'FACULTY', 'STUDENT', 'VOLUNTEER');

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'STUDENT',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Venues Table
CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    facilities TEXT,
    status VARCHAR(50) DEFAULT 'Available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Programs Table
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    date DATE,
    time TIME,
    venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
    organizer VARCHAR(255),
    seats INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Approved',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Registrations Table
CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Registered',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, program_id) -- Prevent duplicate registrations
);

-- 5. Certificates Table
CREATE TABLE certificates (
    id VARCHAR(255) PRIMARY KEY, -- Custom ID like 'CERT-001'
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- e.g., 'Completion', 'Participation'
    issued_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Volunteer Assignments Table
CREATE TABLE volunteer_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    task_description TEXT,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Feedback Table
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, program_id) -- One feedback per user per program
);

-- ==========================================
-- Insert Mock Data
-- ==========================================

-- Insert Users
INSERT INTO users (id, email, name, role) VALUES
    ('11111111-1111-1111-1111-111111111111', 'admin@campusevent.com', 'Admin User', 'ADMIN'),
    ('22222222-2222-2222-2222-222222222222', 'faculty@campusevent.com', 'Faculty User', 'FACULTY'),
    ('33333333-3333-3333-3333-333333333333', 'student@campusevent.com', 'Student User', 'STUDENT'),
    ('44444444-4444-4444-4444-444444444444', 'volunteer@campusevent.com', 'Volunteer User', 'VOLUNTEER');

-- Insert Venues
INSERT INTO venues (id, name, capacity, facilities, status) VALUES
    ('55555555-5555-5555-5555-555555555555', 'Main Auditorium', 1000, 'Projector, Audio, AC', 'Available'),
    ('66666666-6666-6666-6666-666666666666', 'Lab 1', 60, 'Computers, Wi-Fi, Smart Board', 'Available');

-- Insert Programs
INSERT INTO programs (id, title, description, category, date, time, venue_id, organizer, seats, status) VALUES
    ('77777777-7777-7777-7777-777777777777', 'AI & Machine Learning Workshop', 'Learn AI basics with Python and TensorFlow.', 'Workshop', '2026-10-15', '10:00:00', '55555555-5555-5555-5555-555555555555', 'CS Dept', 100, 'Registration Open'),
    ('88888888-8888-8888-8888-888888888888', 'Web Development Bootcamp', 'Build responsive sites with React & Vite.', 'Technical', '2026-10-20', '09:00:00', '66666666-6666-6666-6666-666666666666', 'IT Dept', 50, 'Registration Open');

-- Insert Registrations
INSERT INTO registrations (user_id, program_id, status) VALUES
    ('33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', 'Registered');
