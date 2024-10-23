const express = require("express");
const { Pool } = require("pg"); // PostgreSQL client
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS favourites (
    id SERIAL PRIMARY KEY,
    joke_id VARCHAR(255) UNIQUE NOT NULL,
    joke_text TEXT NOT NULL
  );
`;
pool
  .query(createTableQuery)
  .catch((err) => console.error("Error creating table:", err));

// Route: Search jokes from  API
app.get("/api/search", async (req, res) => {
  const { term = "", page = 1, limit = 10 } = req.query; 

  try {
    const response = await axios.get("https://icanhazdadjoke.com/search", {
      headers: { Accept: "application/json" },
      params: { term, page, limit },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching jokes:", error.message);
    res.status(500).json({ error: "Error fetching jokes" });
  }
});

// Route: Save a joke to favourites
app.post("/api/favourites", async (req, res) => {
  const { joke_id, joke_text } = req.body;

  try {
    const existingJokeQuery = "SELECT * FROM favourites WHERE joke_id = $1";
    const existingJoke = await pool.query(existingJokeQuery, [joke_id]);

    if (existingJoke.rows.length > 0) {
      return res.status(409).json({ message: "Joke is already in favorites" });
    }

    const insertQuery = `
        INSERT INTO favourites (joke_id, joke_text)
        VALUES ($1, $2);
      `;
    await pool.query(insertQuery, [joke_id, joke_text]);
    res.status(201).json({ message: "Joke saved to favourites" });
  } catch (error) {
    console.error("Error saving joke:", error);
    res.status(500).json({ error: "Error saving joke" });
  }
});

// Route: Get all favourite jokes
app.get("/api/favourites", async (req, res) => {
  const query = "SELECT * FROM favourites";
  try {
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error fetching favourites" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
