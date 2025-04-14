// api/activity_log.js
import clientPromise from '../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const client = await clientPromise;
    const dbName = process.env.DB_NAME || 'radios';            // tu BD se llama "radios"
    const db = client.db(dbName);

    // aquí cambias 'logs' por 'radios'
    const collName = process.env.COLLECTION_NAME || 'radios';
    const collection = db.collection(collName);

    const data = await collection
      .find({})
      .sort({ time: -1 })
      .limit(500)
      .toArray();

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(data);
  } catch (error) {
    console.error('❌ /api/activity_log error:', error);
    return res.status(500).json({ error: error.message });
  }
}
