# Blog Application

A full-stack blog application built with React, Node.js, Express, and PostgreSQL. Designed for performance, scalability, and ease of deployment.

## Features

- **User Authentication**: Secure registration and login using JWT (JSON Web Tokens).
- **Blog Posts**: Create, read, update, and delete posts (CRUD).
- **Comments**: Interactive comment sections for each post.
- **Responsive Design**: Modern UI built with Tailwind CSS, fully responsive across devices.
- **Automatic Setup**: Database tables are automatically initialized on server startup.

## Project Structure

```
blog/
├── backend/            # Node.js/Express API server
│   ├── index.js        # Entry point & app logic
│   └── package.json    # Backend dependencies
├── frontend/           # React/Vite client application
│   ├── src/            # Source code (Components, Pages)
│   └── vite.config.js  # Vite configuration
├── render.yaml         # Render deployment configuration (Blueprint)
└── README.md           # Project documentation
```

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: `bcryptjs` (hashing) & `jsonwebtoken` (sessions)
- **Validation**: `validator` library

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7

## Prerequisites

- **Node.js**: v18 or higher recommended.
- **PostgreSQL**: A running instance of PostgreSQL.

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

Create a `.env` file in the `backend` directory:
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/blog_db
JWT_SECRET=your_secure_jwt_secret_key
FRONTEND_URL=http://localhost:5173
```
*   Replace `user`, `password`, and `blog_db` with your actual PostgreSQL credentials.
*   **Note:** The application will automatically create the necessary database tables (`users`, `posts`, `comments`) when you start the server for the first time.

Start the development server:
```bash
npm run dev
```
The server will start at `http://localhost:3000`.

### 2. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

(Optional) Create a `.env` file if your backend is on a different port:
```env
VITE_API_URL=http://localhost:3000
```

Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## Deployment

This project includes a `render.yaml` file for easy deployment on [Render](https://render.com/).

### Deploying to Render
1.  Push this repository to GitHub or GitLab.
2.  Log in to Render and go to **Blueprints**.
3.  Click **New Blueprint Instance** and select your repository.
4.  Render will automatically detect the `render.yaml` configuration and set up:
    *   **PostgreSQL Database** (`blog-db`)
    *   **Backend Service** (`blog-api`)
    *   **Frontend Static Site** (`blog-frontend`)
5.  Click **Apply** to start the deployment.

*Note: The configuration automatically handles environment variables like `DATABASE_URL` and `JWT_SECRET` generation.*

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