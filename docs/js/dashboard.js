class RiskDashboard {
  constructor() {
    this.workerUrl = 'https://zero-trust-gatekeeper.digneyodoi99.workers.dev'
    this.init()
  }

  init() {
    document.getElementById('analyze-btn').addEventListener('click', this.analyze.bind(this))
  }

  async analyze() {
    try {
      const command = document.getElementById('command-input').value
      const res = await fetch(this.workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }) // ◄ Ensures valid JSON
      })
      
      if (!res.ok) throw new Error(await res.text())
      const result = await res.json()
      this.updateUI(result)
      
    } catch (err) {
      console.error("Analysis failed:", err)
      document.getElementById('error').textContent = 
        err.message.includes('Invalid JSON') 
          ? "Invalid command format" 
          : "API error"
    }
  }

  updateUI(result) {
    document.getElementById('risk-score').textContent = (result.risk * 100).toFixed(0) + '%'
    document.getElementById('reasons').innerHTML = 
      result.reasons.map(r => `<li>${r}</li>`).join('')
  }
}

new RiskDashboard()