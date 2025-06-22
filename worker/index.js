// Use dynamic import for TensorFlow to avoid bundling issues
const tfPromise = import('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.0.0/+esm');

// Pre-trained model URL (host this file in your repo's /docs/ai folder)
const MODEL_URL = 'https://yemofio.github.io/zero-trust-gatekeeper/ai/command-model.json';

// Fallback risk scoring for when AI fails
const calculateBasicRisk = (command) => {
  const rules = [
    { pattern: /sudo\s+rm/, score: 0.9 },
    { pattern: /wget\s+.+http:/, score: 0.7 },
    { pattern: /chmod\s+[0-7]{3}/, score: 0.6 },
    { pattern: /\.\/\S+/, score: 0.4 }  // Running local scripts
  ];
  return Math.max(...rules.map(r => 
    r.pattern.test(command) ? r.score : 0
  ));
};

// AI-powered risk explanation
const explainRisk = (command, risk) => {
  const explanations = [];
  if (command.includes('sudo')) explanations.push('Uses sudo privileges');
  if (command.includes('rm')) explanations.push('Contains file deletion command');
  if (risk > 0.8) explanations.push('High-risk pattern detected');
  return explanations.length ? explanations : ['No high-risk patterns found'];
};

// Dummy feedback storage function (replace with your own logic)
async function storeFeedback(request) {
  // Example: just echo back the feedback for now
  const feedback = await request.json();
  return new Response(JSON.stringify({
    status: 'received',
    feedback,
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      // Handle feedback endpoint
      if (pathname === '/api/feedback') {
        return await storeFeedback(request);
      }

      // Default: /api/check or other endpoints
      const { command, user = 'unknown' } = await request.json();

      // 1. Get basic risk score
      let risk = calculateBasicRisk(command);
      let aiUsed = false;

      // 2. Enhance with AI if available
      try {
        const tf = await tfPromise;
        const model = await tf.loadGraphModel(MODEL_URL);
        const input = tf.tensor2d([[
          command.length / 100,          // Normalized length
          risk,                          // Basic score
          user === 'root' ? 1 : 0,       // Root user
          new Date().getHours() / 24      // Time factor
        ]]);
        risk = (await model.predict(input)).dataSync()[0];
        aiUsed = true;
      } catch (aiError) {
        console.warn('AI enhancement failed:', aiError);
      }

      // 3. Generate response
      return new Response(JSON.stringify({
        command,
        user,
        risk: Number(risk.toFixed(2)),
        action: risk > 0.7 ? 'BLOCK' : 'ALLOW',
        aiUsed,
        explanations: explainRisk(command, risk),
        timestamp: new Date().toISOString()
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' 
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Invalid request',
        details: error.message
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}