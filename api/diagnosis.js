// api/diagnosis.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
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

  // Helper function to normalize age unit
  function normalizeAgeUnit(unit) {
    if (unit === "years") return "year";
    if (unit === "months") return "month";
    return unit || "year";
  }

  try {
    console.log('Getting diagnosis with payload:', JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    if (!req.body.sex || !req.body.age) {
      return res.status(400).json({ error: "Missing required fields: sex and age are required" });
    }
    
    // Normalize age structure and fix unit
    let ageValue, ageUnit;
    if (typeof req.body.age === 'object' && req.body.age.value !== undefined) {
      ageValue = parseInt(req.body.age.value);
      ageUnit = normalizeAgeUnit(req.body.age.unit || "year");
    } else {
      ageValue = parseInt(req.body.age) || 30;
      ageUnit = "year";
    }
    
    const diagnosisPayload = {
      sex: req.body.sex,
      age: { value: ageValue, unit: ageUnit },
      evidence: req.body.evidence || [],
      extras: {
        disable_groups: false
      }
    };
    
    console.log('Sending diagnosis payload:', JSON.stringify(diagnosisPayload, null, 2));
    
    const response = await fetch(`${API_URL}/diagnosis`, {
      method: "POST",
      headers,
      body: JSON.stringify(diagnosisPayload),
    });
    
    const responseText = await response.text();
    console.log('Diagnosis response status:', response.status);
    
    if (!response.ok) {
      console.error('Diagnosis failed:', response.status, responseText);
      return res.status(response.status).json({ 
        error: `Infermedica API error: ${responseText}` 
      });
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse diagnosis response:', parseError);
      return res.status(500).json({ error: "Invalid response from Infermedica API" });
    }
    
    console.log('Diagnosis completed successfully');
    console.log('Response summary:', {
      hasQuestion: !!data.question,
      questionType: data.question?.type,
      conditionsCount: data.conditions?.length || 0,
      evidenceCount: data.evidence?.length || 0
    });
    
    return res.json(data);
    
  } catch (err) {
    console.error('Diagnosis error:', err);
    return res.status(500).json({ error: 'Failed to get diagnosis' });
  }
}
