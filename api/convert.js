// api/convert.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { prompt } = req.body;

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': 'Token ' + process.env.REPLICATE_API_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      input: { prompt: prompt, num_inference_steps: 20 }
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}