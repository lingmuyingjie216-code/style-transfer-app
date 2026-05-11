export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { prompt } = req.body;

  const response = await fetch(
    'https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-dev',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.HUGGINGFACE_API_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: prompt })
    }
  );

  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  res.status(200).json({ image: 'data:image/jpeg;base64,' + base64 });
}