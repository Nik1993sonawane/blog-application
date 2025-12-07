require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// -----------------------------------------------------
// DATABASE CONNECTION (PROMISE POOL)
// -----------------------------------------------------
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "blog_app",
  waitForConnections: true,
  connectionLimit: 10,
});

// -----------------------------------------------------
// REGISTER USER API (NEW + FULLY WORKING)
// -----------------------------------------------------
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const [exist] = await pool.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);

    if (exist.length > 0) {
      return res.json({ status: "error", message: "Email Already Exists!" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashed]
    );

    res.json({ status: "success", message: "User Registered Successfully" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ status: "error", message: "Registration Failed" });
  }
});

// -----------------------------------------------------
// LOGIN USER API (NEW + FULLY WORKING)
// -----------------------------------------------------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.json({ status: "error", message: "User Not Found!" });
    }

    const user = rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.json({ status: "error", message: "Invalid Password!" });
    }

    res.json({ status: "success", message: "Login Successfully", user });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ status: "error", message: "Login Failed" });
  }
});

// -----------------------------------------------------
// POSTS API (NEW + FULLY WORKING)
// -----------------------------------------------------

// -----------------------------------------------------
// GET ALL POSTS
// -----------------------------------------------------
app.get("/posts", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM posts ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Fetch Posts Error:", err);
    res.status(500).json({ status: "error", message: "Failed to Fetch Posts" });
  }
});

// -----------------------------------------------------
// CREATE POST (USE REAL USER ID)
// -----------------------------------------------------
app.post("/posts", async (req, res) => {
  try {
    const { title, content, author_id } = req.body;

    if (!title || !content || !author_id) {
      return res.json({
        status: "error",
        message: "Title, content and author are required",
      });
    }

    // ✅ Check user exists
    const [user] = await pool.query(
      "SELECT id FROM users WHERE id=?",
      [author_id]
    );

    if (user.length === 0) {
      return res.json({
        status: "error",
        message: "Author does not exist",
      });
    }

    // ✅ Insert post
    await pool.query(
      "INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)",
      [title.trim(), content.trim(), author_id]
    );

    res.json({
      status: "success",
      message: "Post created successfully"
    });

  } catch (err) {
    console.error("Create Post Error:", err);
    res.status(500).json({
      status: "error",
      message: "Server Error"
    });
  }
});

// -----------------------------------------------------
// UPDATE POST
// -----------------------------------------------------
app.put("/posts/:id", async (req, res) => {
  try {
    const id = req.params.id;

    let fields = [];
    let values = [];

    for (let key of ["title", "content"]) {
      if (req.body[key] !== undefined) {
        fields.push(`${key}=?`);
        values.push(req.body[key]);
      }
    }

    if (fields.length === 0) {
      return res.json({ status: "error", message: "Nothing to Update" });
    }

    const sql = `UPDATE posts SET ${fields.join(
      ", "
    )}, updated_at=NOW() WHERE id=?`;
    values.push(id);

    const [result] = await pool.query(sql, values);

    if (result.affectedRows === 0) {
      return res.json({ status: "error", message: "Post Not Found!" });
    }

    const [post] = await pool.query("SELECT * FROM posts WHERE id=?", [id]);

    res.json({ status: "success", post: post[0] });
  } catch (err) {
    console.error("Update Post Error:", err);
    res.status(500).json({ status: "error", message: "Failed to Update Post" });
  }
});

// -----------------------------------------------------
// DELETE POST
// -----------------------------------------------------
app.delete("/posts/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const [result] = await pool.query("DELETE FROM posts WHERE id=?", [id]);

    if (result.affectedRows === 0) {
      return res.json({ status: "error", message: "Post Not Found!" });
    }

    res.json({ status: "success", message: "Post Deleted Successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ status: "error", message: "Failed to Delete Post" });
  }
});

// -----------------------------------------------------
// COMMENTS API (NEW + FULLY WORKING)
// -----------------------------------------------------

// -----------------------------------------------------
// GET ALL COMMENTS
// -----------------------------------------------------
app.get("/comments/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const [rows] = await pool.query(
      "SELECT id, post_id, content, author_id, created_at FROM comments WHERE post_id=? ORDER BY id DESC",
      [postId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Fetch comments error:", err);
    res.status(500).json({ status: "error", message: "Failed to fetch comments" });
  }
});

// -----------------------------------------------------
// CREATE COMMENTS (USE REAL USER ID)
// -----------------------------------------------------
app.post("/comments", async (req, res) => {
  try {
    const { post_id, content, author_id } = req.body;

    if (!post_id || !content || !author_id) {
      return res.json({ status: "error", message: "Missing fields" });
    }

    const [result] = await pool.query(
      "INSERT INTO comments (post_id, content, author_id) VALUES (?, ?, ?)",
      [post_id, content, author_id]
    );

    const [row] = await pool.query(
      "SELECT id, post_id, content, author_id, created_at FROM comments WHERE id=?",
      [result.insertId]
    );

    res.json({ status: "success", comment: row[0] });
  } catch (err) {
    console.error("Create comment error:", err);
    res.status(500).json({ status: "error", message: "Failed to create comment" });
  }
});

// -----------------------------------------------------
// UPDATE COMMENTS 
// -----------------------------------------------------
app.put("/comments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.json({ status: "error", message: "Content required" });
    }

    const [result] = await pool.query(
      "UPDATE comments SET content=? WHERE id=?",
      [content, id]
    );

    if (result.affectedRows === 0) {
      return res.json({ status: "error", message: "Comment not found" });
    }

    res.json({ status: "success", message: "Comment updated successfully" });
  } catch (err) {
    console.error("Update comment error:", err);
    res.status(500).json({ status: "error", message: "Failed to update comment" });
  }
});

// -----------------------------------------------------
// DELETE COMMENTS 
// -----------------------------------------------------
app.delete("/comments/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM comments WHERE id=?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.json({ status: "error", message: "Comment not found" });
    }

    res.json({ status: "success", message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Delete comment error:", err);
    res.status(500).json({ status: "error", message: "Failed to delete comment" });
  }
});

// -----------------------------------------------------
// START SERVER
// -----------------------------------------------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
