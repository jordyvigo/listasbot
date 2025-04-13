import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
const dbName = 'radios';
const collectionName = 'radios';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const doc = {
      deviceId: req.body.deviceId || 'sin_id',
      time: req.body.time || new Date().toISOString(),
      link: req.body.link || '',
      seo_used: req.body.seo_used || false
    };

    await collection.insertOne(doc);
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar en MongoDB' });
  } finally {
    await client.close();
  }
}