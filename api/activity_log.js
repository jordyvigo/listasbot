// pages/api/activity_log.js
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const client = await clientPromise;
    const db = client.db(); // usa el nombre por defecto de tu URI o especifica db('radios')
    const collection = db.collection('logs'); // ajusta 'logs' al nombre de tu colección

    // Trae los últimos 500 registros ordenados por tiempo descendente
    const data = await collection
      .find({})
      .sort({ time: -1 })
      .limit(500)
      .toArray();

    // Devuelve JSON puro
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error al leer activity_log:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
