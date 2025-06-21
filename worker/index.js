// Zero-trust logic (100k free req/day)
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // Block non-POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // AI Scoring Endpoint
    if (url.pathname === '/api/check') {
      const { command, user } = await request.json();
      
      // Risk calculation (replace with real model)
      const risk = calculateRisk(command, user);
      
      return new Response(JSON.stringify({
        command,
        user,
        risk,
        action: risk > 0.9 ? "BLOCKED" : "ALLOWED",
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), { 
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Mock risk engine (replace with TensorFlow.js)
function calculateRisk(command, user) {
  const riskyKeywords = ["delete", "sudo", "rm -rf", "shadow"];
  let risk = 0;
  
  riskyKeywords.forEach(keyword => {
    if (command.toLowerCase().includes(keyword)) risk += 0.3;
  });
  
  if (user === "root") risk += 0.2;
  
  return Math.min(risk + Math.random() * 0.2, 1); // Cap at 1.0
}
