// api/test-env.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const APP_ID = process.env.INFERMEDICA_APP_ID;
  const APP_KEY = process.env.INFERMEDICA_APP_KEY;

  return res.status(200).json({
    hasAppId: !!APP_ID,
    hasAppKey: !!APP_KEY,
    appIdLength: APP_ID ? APP_ID.length : 0,
    appKeyLength: APP_KEY ? APP_KEY.length : 0,
    appIdPreview: APP_ID ? APP_ID.substring(0, 4) + '...' : 'missing',
    environment: process.env.VERCEL_ENV || 'development',
    timestamp: new Date().toISOString()
  });
}