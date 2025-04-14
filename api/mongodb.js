// lib/mongodb.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('⚠️ Define la variable de entorno MONGO_URI en .env.local');
}

// Cache del cliente en el scope global para reutilizar entre invocaciones
let cachedClient = global._mongoClient;
if (!cachedClient) {
  cachedClient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  global._mongoClient = cachedClient;
}

export default cachedClient;
