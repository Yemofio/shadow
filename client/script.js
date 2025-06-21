// Real-time API call simulator
function simulateAPICalls() {
  const commands = [
    { cmd: "GET /api/users", user: "admin", risk: 0.2 },
    { cmd: "DELETE /db", user: "root", risk: 0.95 },
    { cmd: "POST /upload", user: "hacker", risk: 0.99 }
  ];

  commands.forEach((command, i) => {
    setTimeout(() => {
      const logEntry = document.createElement('div');
      logEntry.className = `log-entry ${command.risk > 0.9 ? 'blocked' : 'allowed'}`;
      logEntry.innerHTML = `[${new Date().toLocaleTimeString()}] <strong>${command.cmd}</strong> | User: ${command.user} | Risk: <span class="score">${command.risk.toFixed(2)}</span>`;
      document.getElementById('alerts').prepend(logEntry);
    }, i * 2000);
  });
}

// Start simulation (replace with real Worker API calls)
simulateAPICalls();
