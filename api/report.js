import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const data = req.body;
  const filePath = path.resolve('./', 'activity_log.json');

  let current = [];
  if (fs.existsSync(filePath)) {
    current = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  current.push(data);
  fs.writeFileSync(filePath, JSON.stringify(current, null, 2));

  res.status(200).json({ status: 'ok' });
}