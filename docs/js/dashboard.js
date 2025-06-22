class RiskDashboard {
  constructor() {
    this.workerUrl = 'https://zero-trust-gatekeeper.digneyodoi99.workers.dev'
    this.init()
  }

  init() {
    document.getElementById('analyze-btn').addEventListener('click', this.analyze.bind(this))
  }

  async analyze() {
    const command = document.getElementById('command-input').value
    const res = await fetch(this.workerUrl, {
      method: 'POST',
      body: JSON.stringify({ command })
    })
    const { risk, reasons } = await res.json()
    
    this.updateUI(risk, reasons)
  }

  updateUI(risk, reasons) {
    document.getElementById('risk-score').textContent = (risk * 100).toFixed(0) + '%'
    document.getElementById('reasons').innerHTML = 
      reasons.map(r => `<li>${r}</li>`).join('')
  }
}

new RiskDashboard()