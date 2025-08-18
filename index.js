import express from "express";
import sqlite3 from "sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET;
app.use();

const db = new sqlite3.Database("./blog.db", (err) => {
    if (err) {
        console.error("Error opening database" = err.message)
    } else {
        // Create the users table
        db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL")
        // Create the posts table with a foreign key to users table
        db.run("CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))")
    }
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})

// Register a new user route
app.post("/register", (req, res) => {
    const {username, password} = req.body
    if (!username || !password) {
        return res.status(400).json({error: "Username and password are required"})
    }

    // Hashing the password before storing it
    const hashedPassword = bcrypt.hashSync(password, 8)
    
    const sql = "INSERT INTO users (username, password) VALUES (?, ?)"

    db.run(sql, [username, hashedPassword], (err) => {
        if (err) {
            // The UNIQUE statement in the database will cause an error if the username is already taken
            return res.status(400).json({error: "Username already taken"})
        }
        res.status(201).json({message: "User created successfully", userId: this.lastID}) 
    })
})

// Login route

app.post("/login", (req, res) => {
    const {username, password} = req.body
    const sql = "SELECT * FROM user WHERE username = ?"

    db.get(sql, [username], (err, user) => {
        if (err || !user) {
            return res.status(401).json({error: "Invalid credentials"})
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if (!passwordIsValid) {
            return res.status(401).json({error: "Invalid credentials"})
        } 
        
        const token = jwt.sign({id: user.id}, JWT_SECRET, {
            expiresIn: 86400
        })

        res.status(200).json({message: "Login successful", token: token})
    })
})

// Middleware to verify the JWT

const authenticateToken = (req, res, next) => {
    const authHeader = req.Header["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (token == null) {
        return res.sendStatus(401)
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }

        req.user = user
        next()
    })
}
