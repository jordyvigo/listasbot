import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = 'radios';
const collectionName = 'radios';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const logs = await collection.find({}).sort({ time: -1 }).limit(100).toArray();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer desde MongoDB' });
  } finally {
    await client.close();
  }
}