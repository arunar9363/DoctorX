// api/symptoms.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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
  const API_URL = "https://api.infermedica.com/v3";

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
    const { q, age = "25", language = "en" } = req.query;
    
    if (q) {
      // Use suggest endpoint for symptom search
      const searchPayload = {
        phrase: q,
        sex: "male",
        age: { value: parseInt(age), unit: "year" },
        max_results: 10
      };
      
      const response = await fetch(`${API_URL}/suggest`, {
        method: "POST",
        headers,
        body: JSON.stringify(searchPayload),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Infermedica API error:', response.status, errorText);
        return res.status(response.status).json({ error: `Infermedica API error: ${errorText}` });
      }
      
      const data = await response.json();
      const symptoms = data.filter(item => item.type === 'symptom');
      return res.json(symptoms);
      
    } else {
      // Get all symptoms
      const response = await fetch(`${API_URL}/symptoms?age.value=${age}&language=${language}`, {
        headers,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Symptoms API error:', response.status, errorText);
        return res.status(response.status).json({ error: `Infermedica API error: ${errorText}` });
      }
      
      const data = await response.json();
      return res.json(data);
    }
    
  } catch (err) {
    console.error('Symptoms fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch symptoms' });
  }
}