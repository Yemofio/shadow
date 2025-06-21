// Free tier: 100k req/day, near-zero latency
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // JWT Validation (replace with your auth logic)
    if (!validateJWT(request.headers.get("Authorization"))) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Geo-Fencing (block non-US/CA/GB)
    const country = request.cf.country;
    if (!["US", "CA", "GB"].includes(country)) {
      return new Response("Blocked: Unauthorized region", { status: 403 });
    }

    // AI Anomaly Check
    if (url.pathname === "/api/check") {
      const data = await request.json();
      const score = await runAIModel(env.AI_MODEL, data);
      return Response.json({ score });
    }

    return new Response("Not found", { status: 404 });
  }
}

// Workers KV for model storage (free 1GB)
async function runAIModel(kvNamespace, data) {
  const model = await kvNamespace.get("latest_model.json", "json");
  // ... TF.js inference logic
  return score;
}
