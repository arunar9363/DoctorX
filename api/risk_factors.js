// api/risk_factors.js
export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // eslint-disable-next-line no-undef
  const APP_ID = process.env.INFERMEDICA_APP_ID;
  // eslint-disable-next-line no-undef
  const APP_KEY = process.env.INFERMEDICA_APP_KEY;
  const API_URL = "https://api.infermedica.com/v3";

  // Check if credentials are available
  if (!APP_ID || !APP_KEY) {
    console.error('Missing Infermedica credentials');
    return res.status(500).json({ error: 'Missing API credentials' });
  }

  const headers = {
    "App-Id": APP_ID,
    "App-Key": APP_KEY,
    "Content-Type": "application/json",
    "Interview-Id": `interview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };

  try {
    const { language = "en", age = "25" } = req.query;
    
    console.log('Fetching risk factors for age:', age);
    
    const response = await fetch(`${API_URL}/risk_factors?age.value=${age}&language=${language}`, {
      headers,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Risk factors API error:', response.status, errorText);
      return res.status(response.status).json({ error: `Infermedica API error: ${errorText}` });
    }
    
    const data = await response.json();
    console.log('Risk factors:', data.length, 'items');
    return res.json(data);
    
  } catch (err) {
    console.error('Risk factors fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch risk factors' });
  }
}