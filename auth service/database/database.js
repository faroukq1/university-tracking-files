const db = require("mysql2/promise");
require("dotenv").config();
// Parse the DATABASE_URL
const urlParts = process.env.DATABASE_URL.match(
  /mysql:\/\/(.*?):(.*?)@(.*?):(\d+)\/(.*)/
);
const username = urlParts[1];
const password = urlParts[2];
const host = urlParts[3];
const port = urlParts[4];
const database = urlParts[5];

const pool = db.createPool({
  host,
  user: username,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
