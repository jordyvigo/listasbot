// api/report.js
import client from '../lib/mongodb';

export default async function handler(req, res) {
  console.log('[report] Invocado', req.method, req.body);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  if (!process.env.MONGO_URI) {
    console.error('[report] Falta MONGO_URI');
    return res.status(500).json({ error: 'Configuración de base de datos faltante' });
  }

  try {
    await client.connect();
    console.log('[report] Conectado a MongoDB');

    const db = client.db('radios');
    const collection = db.collection('radios');
    const doc = {
      deviceId: req.body.deviceId || 'sin_id',
      time:     req.body.time     || new Date().toISOString(),
      link:     req.body.link     || '',
      seo_used: Boolean(req.body.seo_used),
    };
    console.log('[report] Insertando:', doc);

    const result = await collection.insertOne(doc);
    console.log('[report] Insertado con _id:', result.insertedId);

    return res.status(200).json({ status: 'ok', id: result.insertedId });
  } catch (error) {
    console.error('[report] Error en MongoDB:', error);
    return res.status(500).json({ error: 'Error al guardar en MongoDB' });
  }
}
