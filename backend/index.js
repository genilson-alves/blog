import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("FATAL ERROR: DATABASE_URL is not defined.");
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const initializeDatabase = async () => {
  try {
    await db.query("SELECT NOW()");
    console.log("Database connected successfully");

    const usersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );`;

    const postsTable = `
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );`;

    const commentsTable = `
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );`;

    await db.query(usersTable);
    await db.query(postsTable);
    await db.query(commentsTable);
    console.log("Tables created or verified successfully.");

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

initializeDatabase();

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!validator.isLength(username, { min: 4, max: 20 }))
    return res
      .status(400)
      .json({ error: "Username must be between 4 and 20 characters." });
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  )
    return res.status(400).json({
      error:
        "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a symbol.",
    });

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql =
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id";
    const result = await db.query(sql, [username, hashedPassword]);
    res.status(201).json({
      message: "User created successfully",
      userId: result.rows[0].id,
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Username already taken" });
    }
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || username.length < 4) {
    return res
      .status(400)
      .json({ error: "Username must be at least 4 characters." });
  }

  const sql = "SELECT * FROM users WHERE username = $1";
  try {
    const result = await db.query(sql, [username]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: 86400 }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get("/posts", async (req, res) => {
  const sql = `
        SELECT p.id, p.title, p.content, p.user_id, p.created_at, u.username as author,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comment_count
        FROM posts p JOIN users u ON p.user_id = u.id 
        ORDER BY p.created_at DESC LIMIT 10`;
  try {
    const result = await db.query(sql);
    res.json({ posts: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/posts", authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !validator.isLength(title.trim(), { min: 1 }))
    return res.status(400).json({ error: "Title is required" });
  if (!content || !validator.isLength(content.trim(), { min: 1 }))
    return res.status(400).json({ error: "Content is required" });

  const sql =
    "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING id";
  try {
    const result = await db.query(sql, [title, content, req.user.id]);
    res.status(201).json({
      message: "Post created",
      postId: result.rows[0].id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/posts/:id", authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !validator.isLength(title.trim(), { min: 1 }))
    return res.status(400).json({ error: "Title is required" });
  if (!content || !validator.isLength(content.trim(), { min: 1 }))
    return res.status(400).json({ error: "Content is required" });

  const sql =
    "UPDATE posts SET title = $1, content = $2 WHERE id = $3 AND user_id = $4";
  try {
    const result = await db.query(sql, [
      title,
      content,
      req.params.id,
      req.user.id,
    ]);
    if (result.rowCount === 0)
      return res.status(404).json({
        error: "Post not found or you don't have permission to edit it.",
      });
    res.json({ message: "Post updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/posts/:id", authenticateToken, async (req, res) => {
  const sql = "DELETE FROM posts WHERE id = $1 AND user_id = $2";
  try {
    const result = await db.query(sql, [req.params.id, req.user.id]);
    if (result.rowCount === 0)
      return res.status(404).json({
        error: "Post not found or you don't have permission to delete it.",
      });
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/posts/:postId/comments", async (req, res) => {
  const sql = `
        SELECT c.id, c.content, c.user_id, c.created_at, u.username as author 
        FROM comments c JOIN users u ON c.user_id = u.id 
        WHERE c.post_id = $1 ORDER BY c.created_at ASC`;
  try {
    const result = await db.query(sql, [req.params.postId]);
    res.json({ comments: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/posts/:postId/comments", authenticateToken, async (req, res) => {
  const { content } = req.body;
  if (!content || !validator.isLength(content.trim(), { min: 1 }))
    return res.status(400).json({ error: "Content is required" });

  const sql =
    "INSERT INTO comments (content, post_id, user_id) VALUES ($1, $2, $3) RETURNING id";
  try {
    const result = await db.query(sql, [
      content,
      req.params.postId,
      req.user.id,
    ]);
    res.status(201).json({
      message: "Comment created",
      commentId: result.rows[0].id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/comments/:id", authenticateToken, async (req, res) => {
  const { content } = req.body;
  if (!content || !validator.isLength(content.trim(), { min: 1 }))
    return res.status(400).json({ error: "Content is required" });

  const sql = "UPDATE comments SET content = $1 WHERE id = $2 AND user_id = $3";
  try {
    const result = await db.query(sql, [content, req.params.id, req.user.id]);
    if (result.rowCount === 0)
      return res.status(404).json({
        error: "Comment not found or you don't have permission to edit it.",
      });
    res.json({ message: "Comment updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/comments/:id", authenticateToken, async (req, res) => {
  const sql = "DELETE FROM comments WHERE id = $1 AND user_id = $2";
  try {
    const result = await db.query(sql, [req.params.id, req.user.id]);
    if (result.rowCount === 0)
      return res.status(404).json({
        error: "Comment not found or you don't have permission to delete it.",
      });
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
