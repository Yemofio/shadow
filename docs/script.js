// Real-time API call simulator (replace with actual Worker calls)
async function fetchAlerts() {
  // ▼ UPDATE THIS LINE ▼ (use Worker URL)
  const response = await fetch('https://zero-trust-gatekeeper.digneyodoi99.workers.dev/api/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      command: 'sudo rm -rf /',  // Example malicious command
      user: 'root'               // Example privileged user
    })
  });
  
  const result = await response.json();
  const alertBox = document.getElementById('alerts');
  alertBox.innerHTML += `
    <div class="log-entry ${result.action === 'BLOCKED' ? 'blocked' : 'allowed'}">
      [${new Date().toLocaleTimeString()}] 
      Command: <strong>${result.command}</strong> | 
      User: ${result.user} | 
      Risk: ${result.risk.toFixed(2)} → 
      <span class="action">${result.action}</span>
    </div>
  `;
}

// Call every 3 seconds (simulate live monitoring)
setInterval(fetchAlerts, 3000);
