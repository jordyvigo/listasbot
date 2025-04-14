import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = 'radios';
const collectionName = 'radios';

export default async function handler(req, res) {
  // Log cada petición
  const now = new Date().toISOString();
  const ip =
    req.headers['x-forwarded-for']?.split(',').shift() ||
    req.socket.remoteAddress;
  console.log(`[${now}] ${req.method} ${req.url} from ${ip}`);

  if (req.method !== 'GET') {
    console.log(`[${now}] Método no permitido: ${req.method}`);
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const logs = await collection
      .find({})
      .sort({ time: -1 })
      .limit(100)
      .toArray();

    console.log(`[${now}] Devolviendo ${logs.length} registros`);
    res.status(200).json(logs);
  } catch (error) {
    console.error(`[${now}] Error al leer desde MongoDB:`, error);
    res.status(500).json({ error: 'Error al leer desde MongoDB' });
  } finally {
    await client.close();
  }
}
