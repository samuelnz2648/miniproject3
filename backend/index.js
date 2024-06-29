// File path: backend/index.js

require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL server.");
});

// Create a new contact
app.post("/api/contacts", (req, res, next) => {
  const { name, email, phone } = req.body;
  const sql = "INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)";
  db.query(sql, [name, email, phone], (err, result) => {
    if (err) return next(err);
    res.send({ id: result.insertId, name, email, phone });
  });
});

// Get all contacts
app.get("/api/contacts", (req, res, next) => {
  const sql = "SELECT * FROM contacts";
  db.query(sql, (err, results) => {
    if (err) return next(err);
    res.send(results);
  });
});

// Update a contact
app.put("/api/contacts/:id", (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const sql = "UPDATE contacts SET name = ?, email = ?, phone = ? WHERE id = ?";
  db.query(sql, [name, email, phone, id], (err, result) => {
    if (err) return next(err);
    res.send(result);
  });
});

// Delete a contact
app.delete("/api/contacts/:id", (req, res, next) => {
  const { id } = req.params;
  const sql = "DELETE FROM contacts WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return next(err);
    res.send(result);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
