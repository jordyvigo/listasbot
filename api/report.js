// pages/api/report.js
import client from '../../lib/mongodb';

export default async function handler(req, res) {
  console.log('[report] Método recibido:', req.method);
  console.log('[report] Body recibido:', req.body);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Conecta (si ya está conectado, no hace nada)
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
    console.log('[report] Insertando documento:', doc);

    const result = await collection.insertOne(doc);
    console.log('[report] Documento insertado con _id:', result.insertedId);

    return res.status(200).json({ status: 'ok', id: result.insertedId });
  } catch (error) {
    console.error('[report] Error al guardar en MongoDB:', error);
    return res.status(500).json({ error: 'Error al guardar en MongoDB' });
  }
}
