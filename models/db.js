require('dotenv').config();

const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
  const url = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;
  const client = new MongoClient(url);

  client.connect();
  console.log('Connected successfully to server');
  // Database Name
  const dbName = process.env.DB_NAME;
  const db = client.db(dbName);

module.exports = db;