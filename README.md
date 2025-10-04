# Library Management System

A full-stack web application for managing a library's books, users, and borrow records. Built as part of the SIWES (Students Industrial Work Experience Scheme) project, it allows librarians to handle book inventory, track borrowing, generate reports, and view analytics without requiring student accounts.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Key Decisions and Challenges](#key-decisions-and-challenges)
- [Contributing](#contributing)
- [License](#license)

## Features
- **User Authentication**: Librarian login/register with JWT-based security.
- **Book Management**: Add, edit, delete, and view books with details like title, author, ISBN, and copies.
- **Borrow Records**: Borrow books for students (no student accounts needed), return books, and track due dates.
- **Dashboard**: Overview with stats (total books, users, active borrows, overdue), recent activity, and dynamic change percentages.
- **Reports**: View overdue books with fines, most borrowed books, and active users (top borrowers).
- **Responsive UI**: Built with React and Tailwind CSS for a modern, mobile-friendly interface.
- **Real-Time Updates**: Modals for confirmations, loading states, and error handling.
- **Data Persistence**: PostgreSQL database hosted on Render, with daily stats tracking for trends.

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React (icons), React Router, React Hot Toast (notifications), Shadcn/UI (components).
- **Backend**: Node.js, Express.js, PostgreSQL (via pg library), JWT for authentication, bcrypt for password hashing.
- **Database**: PostgreSQL hosted on Render.
- **Deployment**: Frontend on Vercel, Backend on Render.
- **Other**: ESLint, CORS, dotenv for environment variables.

## Prerequisites
- Node.js (v16+)
- PostgreSQL (local or Render)
- Git
- A code editor (e.g., VS Code)

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/siwes-library-management.git
   cd siwes-library-management