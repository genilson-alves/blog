import express from "express";
import sqlite3 from "sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";
dotenv.config();

const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET;
app.use(express.json());

const db = new sqlite3.Database("./blog.db", (err) => {
  if (err) {
    console.error("Error opening database " + err.message);
  } else {
    // Create the users table
    db.run(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL)"
    );
    // Create the posts table with a foreign key to users table
    db.run(
      "CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL, user_id INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id))"
    );
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Register a new user route
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  if (!validator.isLength(username, { min: 3, max: 20 })) {
    return res
      .status(400)
      .json({ error: "Username must be between 3 and 20 characters." });
  }
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return res.status(400).json({
      error:
        "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a symbol.",
    });
  }
  // Hashing the password before storing it
  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
  db.run(sql, [username, hashedPassword], function (err) {
    if (err) {
      // The UNIQUE statement in the database will cause an error If the username is already taken
      return res.status(400).json({ error: "Username already taken" });
    }
    res
      .status(201)
      .json({ message: "User created successfully", userId: this.lastID });
  });
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";
  db.get(sql, [username], (err, user) => {
    if (err) {
      return res.status(401).json({ error: err.message });
    }
    if (!user) {
      console.log("Login failed: User not found.");
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: 86400,
    });
    res.status(200).json({ message: "Login successful", token: token });
  });
});

// Middleware to verify the JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Get all posts routes
app.get("/posts", (req, res) => {
  const sql = "SELECT * FROM posts ORDER BY created_at DESC limit 10";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ posts: rows });
  });
});

// Create a new post
app.post("/posts", authenticateToken, (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  const sql = "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)";
  db.run(sql, [title, content, userId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: "Post created", postId: this.lastId });
  });
});

// Delete a post
app.delete("/posts/:id", authenticateToken, (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const verifySql = "SELECT user_id FROM posts WHERE id = ?";
  db.get(verifySql, [postId], (err, post) => {
    if (err || !post) {
      return res.status(404).json({ error: "Post not found" });
    }
    // Checking If the post being deleted is from the user trying to delete it
    if (post.userId !== userId) {
      return res
        .status(403)
        .json({ error: "The post can only be deleted by the author" });
    }
    // If the check is alright, proceed
    const deleteSql = "DELETE FROM posts WHERE id = ?";
    db.run(deleteSql, [postId], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Post deleted" });
    });
  });
});
