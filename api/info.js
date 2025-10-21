// api/info.js
export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json'); // IMPORTANT!

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const APP_ID = process.env.INFERMEDICA_APP_ID;
  const APP_KEY = process.env.INFERMEDICA_APP_KEY;
  const API_URL = "https://api.infermedica.com/v3";

  // Check if credentials are available
  if (!APP_ID || !APP_KEY) {
    console.error('Missing Infermedica credentials');
    return res.status(500).json({ 
      error: 'Missing API credentials',
      details: 'INFERMEDICA_APP_ID and INFERMEDICA_APP_KEY must be configured'
    });
  }

  // Set up headers for Infermedica API
  const headers = {
    "App-Id": APP_ID,
    "App-Key": APP_KEY,
    "Content-Type": "application/json",
    "Interview-Id": `info-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };

  try {
    console.log('Fetching API info from Infermedica...');
    
    const response = await fetch(`${API_URL}/info`, {
      method: 'GET',
      headers,
    });
    
    console.log('Infermedica API info response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Infermedica API info error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `Infermedica API error: ${errorText}`,
        status: response.status 
      });
    }
    
    const data = await response.json();
    console.log('API info retrieved successfully');
    
    // Return the API info data
    return res.json(data);
    
  } catch (err) {
    console.error('API info fetch error:', err);
    return res.status(500).json({ 
      error: 'Failed to fetch API info',
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
}