// pages/api/activity_log.js
import clientPromise from '../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME || 'radios');
    const collection = db.collection('logs');

    const data = await collection
      .find({})
      .sort({ time: -1 })
      .limit(500)
      .toArray();

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error al leer activity_log:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
