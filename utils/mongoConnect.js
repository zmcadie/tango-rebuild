import { MongoClient } from 'mongodb'

const connectionString = process.env.DB_URL
const dbName = process.env.DB_NAME

if (!connectionString) {
  throw new Error(
    'Please define the DB_URL environment variable inside .env.local'
  )
}

if (!dbName) {
  throw new Error(
    'Please define the DB_NAME environment variable inside .env.local'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
 let cached = global.mongo

 if (!cached) {
   cached = global.mongo = { conn: null, promise: null }
 }

export default async function mongoConnect() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }

    console.log("Connecting to mongo client")
    cached.promise = MongoClient.connect(connectionString, connectionOptions).then((client) => ({ client, db: client.db(dbName) }))
  }
  cached.conn = await cached.promise
  return cached.conn
}