// api/health.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // eslint-disable-next-line no-undef
  const APP_ID = process.env.INFERMEDICA_APP_ID;
  // eslint-disable-next-line no-undef
  const APP_KEY = process.env.INFERMEDICA_APP_KEY;

  try {
    return res.json({ 
      status: "OK", 
      timestamp: new Date().toISOString(),
      credentials: {
        APP_ID: APP_ID ? "✓" : "✗",
        APP_KEY: APP_KEY ? "✓" : "✗"
      },
      apiVersion: "v3",
      // eslint-disable-next-line no-undef
      environment: process.env.VERCEL_ENV || "development",
      availableEndpoints: [
        "GET /api/symptoms - Get symptoms (with optional search)",
        "POST /api/diagnosis - Interactive diagnosis with questions",
        "POST /api/triage - Get triage recommendation",
        "GET /api/risk_factors - Get risk factors",
        "GET /api/info - API information",
        "GET /api/health - Health check"
      ]
    });
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({ 
      status: "ERROR",
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
}