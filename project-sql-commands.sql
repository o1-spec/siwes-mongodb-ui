-- SIWES Database Project - SQL Commands Documentation
-- This file contains all SQL commands executed during the development of the SIWES Library Management System.
-- Commands are grouped by purpose, with explanations of when and why they were used.
-- Run these in PSQL connected to your Render PostgreSQL database.

-- ## 1. Initial Database Setup (Local/Render DB)
-- These create the core tables for users, books, and borrow records.

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Books Table
CREATE TABLE IF NOT EXISTS books (
  book_id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  published_year INTEGER,
  isbn VARCHAR(20),
  copies_available INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Borrow Records Table (Initial with user_id)
CREATE TABLE IF NOT EXISTS borrow_records (
  record_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  book_id INTEGER REFERENCES books(book_id) ON DELETE CASCADE,
  borrow_date DATE DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  return_date DATE,
  status VARCHAR(20) DEFAULT 'borrowed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
CREATE INDEX IF NOT EXISTS idx_borrow_records_user ON borrow_records(user_id);
CREATE INDEX IF NOT EXISTS idx_borrow_records_book ON borrow_records(book_id);
CREATE INDEX IF NOT EXISTS idx_borrow_records_status ON borrow_records(status);

-- ## 2. Table Modifications (Render DB)
-- Changes to existing tables for project requirements.

-- Drop and Recreate Borrow Records (with user_name)
DROP TABLE borrow_records;
CREATE TABLE borrow_records (
  record_id SERIAL PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  book_id INTEGER REFERENCES books(book_id),
  borrow_date DATE DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  return_date DATE,
  status VARCHAR(20) DEFAULT 'borrowed'
);

-- Alter Borrow Date to TIMESTAMP
ALTER TABLE borrow_records ALTER COLUMN borrow_date TYPE TIMESTAMP;
ALTER TABLE borrow_records ALTER COLUMN borrow_date SET DEFAULT CURRENT_TIMESTAMP;

-- Create Stats History Table
CREATE TABLE stats_history (
  id SERIAL PRIMARY KEY,
  date DATE DEFAULT CURRENT_DATE UNIQUE,
  total_books INTEGER,
  total_users INTEGER,
  active_borrows INTEGER,
  overdue_books INTEGER
);

-- ## 3. Data Inserts and Updates (Render DB)
-- Populating or updating data.

-- Insert Daily Stats into Stats History
INSERT INTO stats_history (total_books, total_users, active_borrows, overdue_books)
VALUES (
  (SELECT COUNT(*) FROM books),
  (SELECT COUNT(*) FROM users),
  (SELECT COUNT(*) FROM borrow_records WHERE return_date IS NULL),
  (SELECT COUNT(*) FROM borrow_records br JOIN books b ON br.book_id = b.book_id WHERE br.return_date IS NULL AND br.due_date < CURRENT_DATE)
)
ON CONFLICT (date) DO UPDATE SET
  total_books = EXCLUDED.total_books,
  total_users = EXCLUDED.total_users,
  active_borrows = EXCLUDED.active_borrows,
  overdue_books = EXCLUDED.overdue_books;

-- Insert Historical Stats (Example)
INSERT INTO stats_history (date, total_books, total_users, active_borrows, overdue_books)
VALUES (CURRENT_DATE - INTERVAL '1 day', 5, 2, 1, 0);

-- ## 4. Queries Used in Server Routes (Executed via Node.js)
-- These are run by the server for API endpoints. Examples only; parameters are handled dynamically.

-- Select All Users
SELECT * FROM users ORDER BY user_id ASC;

-- Insert User
INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *;

-- Select Borrow Records
SELECT br.record_id, br.user_name, b.title, br.borrow_date, br.due_date, br.return_date, br.status
FROM borrow_records br
JOIN books b ON br.book_id = b.book_id
ORDER BY br.record_id ASC;

-- Insert Borrow Record
INSERT INTO borrow_records (user_name, book_id, due_date) VALUES ($1, $2, $3) RETURNING *;

-- Update Return
UPDATE borrow_records SET return_date = CURRENT_DATE, status = $1 WHERE record_id = $2 RETURNING *;

-- Reports: Most Borrowed
SELECT b.title, COUNT(br.record_id) AS borrow_count
FROM borrow_records br
JOIN books b ON br.book_id = b.book_id
GROUP BY b.book_id, b.title
ORDER BY borrow_count DESC
LIMIT 10;

-- Reports: Active Users
SELECT br.user_name, COUNT(br.record_id) AS borrow_count
FROM borrow_records br
GROUP BY br.user_name
ORDER BY borrow_count DESC
LIMIT 10;

-- Reports: Overdue
SELECT br.user_name, b.title, br.due_date,
       (CURRENT_DATE - br.due_date) AS overdue_days,
       ((CURRENT_DATE - br.due_date) * 1) AS fine
FROM borrow_records br
JOIN books b ON br.book_id = b.book_id
WHERE br.return_date IS NULL AND br.due_date < CURRENT_DATE;

-- Fetch Previous Stats
SELECT total_books AS totalBooks, total_users AS totalUsers, active_borrows AS activeBorrows, overdue_books AS overdueBooks
FROM stats_history
WHERE date = CURRENT_DATE - INTERVAL '1 day'
LIMIT 1;

-- Notes
-- - Execution: Run table creations/modifications in PSQL. Server queries are handled by Node.js.
-- - Backup: Always back up Render DB before changes.
-- - Updates: Tables evolved (e.g., borrow_records from user_id to user_name).
-- - If Issues: Check Render DB connection and table existence.