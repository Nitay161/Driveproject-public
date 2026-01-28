const { MongoClient } = require("mongodb");

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const DB_NAME = "drive";

const client = new MongoClient(MONGO_URL);

let db = null;

async function connectDB() {
  if (db) return db; // already connected

  await client.connect();
  db = client.db(DB_NAME);
  console.log("✅ MongoDB connected");

  // Ensure unique index on username
  await getDb().collection("users").createIndex({ username: 1 }, { unique: true });

  return db;
}

function getDb() {
  if (!db) {
    throw new Error("MongoDB not initialized. Call connectDB first.");
  }
  return db;
}

module.exports = { connectDB, getDb };