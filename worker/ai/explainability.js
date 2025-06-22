// Risk explanation using open-source models
export const explainRisk = (command) => {
  const keywords = {
    'sudo': 0.4,
    'rm': 0.7,
    'chmod': 0.5,
    'wget': 0.3
  }
  
  let score = 0
  let reasons = []
  
  Object.entries(keywords).forEach(([kw, weight]) => {
    if (command.includes(kw)) {
      score += weight
      reasons.push(`Contains high-risk keyword "${kw}"`)
    }
  })
  
  return {
    score: Math.min(score, 1),
    reasons
  }
}