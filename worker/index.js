// Use dynamic import for TensorFlow to avoid bundling issues
const tfPromise = import('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.0.0/+esm');

// Pre-trained model URL (host this file in your repo's /docs/ai folder)
const MODEL_URL = 'https://yemofio.github.io/zero-trust-gatekeeper/worker/ai/pretrained/command-model.json';

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

const explainRisk = (command, risk) => {
  const explanations = [];
  if (command.includes('sudo')) explanations.push('Uses sudo privileges');
  if (command.includes('rm')) explanations.push('Contains file deletion command');
  if (risk > 0.8) explanations.push('High-risk pattern detected');
  return explanations.length ? explanations : ['No high-risk patterns found'];
};

function analyzeCommand(command) {
  const score = calculateBasicRisk(command);
  const reasons = explainRisk(command, score);
  return { score, reasons };
}

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
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Handle feedback endpoint
    if (pathname === '/api/feedback') {
      return await storeFeedback(request);
    }

    // Robust JSON parsing for /api/check and other endpoints
    let data;
    try {
      data = await request.json();
    } catch (err) {
      return new Response(
        JSON.stringify({
          error: "Invalid JSON",
          details: "Expected format: {\"command\":\"your-command\"}"
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Proceed with analysis if JSON is valid
    const { command = "", user = "anonymous" } = data;
    const { score, reasons } = analyzeCommand(command);

    return new Response(JSON.stringify({
      command,
      risk: score,
      action: score > 0.7 ? 'BLOCK' : 'ALLOW',
      reasons
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}