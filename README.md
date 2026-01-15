# Blog Application

A full-stack blog application built with React, Node.js, Express, and PostgreSQL.

## Features

- **User Authentication**: Secure registration and login using JWT.
- **Blog Posts**: Create, read, update, and delete posts.
- **Comments**: Add comments to posts.
- **Responsive Design**: Built with Tailwind CSS for a modern, responsive UI.

## Tech Stack

### Backend
- **Node.js & Express**: RESTful API server.
- **PostgreSQL**: Relational database for storing users, posts, and comments.
- **Authentication**: `bcryptjs` for password hashing and `jsonwebtoken` for session management.
- **Validation**: `validator` for input sanitization and validation.

### Frontend
- **React**: UI library.
- **Vite**: Build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework.
- **React Router**: Client-side routing.

## Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL installed and running

## Getting Started

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/blog_db
JWT_SECRET=your_secure_jwt_secret_key
```
*Note: Replace `user`, `password`, and `blog_db` with your PostgreSQL credentials.*

Initialize the database (the app will create tables automatically on first run):
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

(Optional) Create a `.env` file if your backend is running on a different port/URL:
```env
VITE_API_URL=http://localhost:3000
```

Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Login user | No |
| GET | `/posts` | Get all posts | No |
| POST | `/posts` | Create a new post | Yes |
| PUT | `/posts/:id` | Update a post | Yes |
| DELETE | `/posts/:id` | Delete a post | Yes |
| GET | `/posts/:postId/comments` | Get comments for a post | No |
| POST | `/posts/:postId/comments` | Add a comment | Yes |
| PUT | `/comments/:id` | Update a comment | Yes |
| DELETE | `/comments/:id` | Delete a comment | Yes |

## License

ISC
