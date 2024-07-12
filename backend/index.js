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

// Helper function to handle database queries
const handleQuery = (sql, params, res, next) => {
  db.query(sql, params, (err, result) => {
    if (err) return next(err);
    res.send(result);
  });
};

// Create a new contact
app.post("/api/contacts", (req, res, next) => {
  const { name, email, phone } = req.body;
  const sql = "INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)";
  db.query(sql, [name, email, phone], (err, result) => {
    if (err) return next(err);
    const newContact = { id: result.insertId, name, email, phone };
    res.send(newContact);
  });
});

// Get all contacts
app.get("/api/contacts", (req, res, next) => {
  const sql = "SELECT * FROM contacts";
  handleQuery(sql, [], res, next);
});

// Update a contact
app.put("/api/contacts/:id", (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const sql = "UPDATE contacts SET name = ?, email = ?, phone = ? WHERE id = ?";
  handleQuery(sql, [name, email, phone, id], res, next);
});

// Delete a contact
app.delete("/api/contacts/:id", (req, res, next) => {
  const { id } = req.params;
  const sql = "DELETE FROM contacts WHERE id = ?";
  handleQuery(sql, [id], res, next);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
