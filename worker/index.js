import { explainRisk } from './ai/explainability'
import * as tf from '@tensorflow/tfjs'

// Add these lines after imports
let model
const loadModel = async () => {
  model = await tf.loadGraphModel(
    'https://yemofio.github.io/zero-trust-gatekeeper/ai/pretrained/command-model.json'
  )
}
loadModel() // Warm up model

// Replace your existing fetch handler
export default {
  async fetch(request) {
    const { command, user } = await request.json()
    
    // AI Analysis
    const { score, reasons } = explainRisk(command)
    const tensorInput = tf.tensor2d([[command.length / 100, score]])
    const aiScore = model ? (await model.predict(tensorInput).dataSync()[0] : score
    
    return new Response(JSON.stringify({
      command,
      risk: aiScore,
      action: aiScore > 0.7 ? 'BLOCK' : 'ALLOW',
      reasons
    }), { 
      headers: { 'Content-Type': 'application/json' } 
    })
  }
}
// This is a Cloudflare Worker script that processes incoming requests
// and evaluates the risk of a command using a pre-trained AI model.
// It uses TensorFlow.js for model inference and a custom explainability function
// to provide insights into the risk score.
// The script loads the model at startup and handles requests by analyzing the command,
// calculating a risk score, and returning an action recommendation along with reasons for the score.
// The response includes the original command, the calculated risk score, the recommended action (BLOCK or ALLOW),
// and any reasons for the risk assessment. The model is loaded asynchronously to ensure it is ready for inference when requests are made.
// The script is designed to run in a serverless environment, such as Cloudflare Workers,
// where it can handle multiple requests efficiently without maintaining state between them.
// The AI model is expected to be a TensorFlow.js model hosted at the specified URL,
// and the explainRisk function is a custom implementation that evaluates the command for specific keywords
// that indicate potential risk. The risk score is calculated based on the presence of these keywords,
// and the model's prediction is adjusted based on the command's length and the initial risk score.
// The script is structured to be efficient and responsive, providing quick feedback on command risk
// while leveraging AI capabilities for enhanced security analysis.
// The script is designed to be modular, allowing for easy updates to the AI model or the explainability logic
// without significant changes to the overall structure.
// The use of TensorFlow.js allows for running machine learning models directly in the browser or serverless environments,
// making it suitable for real-time applications like this command risk assessment.
// The script is also designed to be extensible, allowing for future enhancements such as
// integrating additional AI models, improving the explainability function, or adding more complex risk assessment logic.
// The AI model is expected to be a TensorFlow.js model hosted at the specified URL,
// and the explainRisk function is a custom implementation that evaluates the command for specific keywords
// that indicate potential risk. The risk score is calculated based on the presence of these keywords,
// and the model's prediction is adjusted based on the command's length and the initial risk score.
// The script is structured to be efficient and responsive, providing quick feedback on command risk
// while leveraging AI capabilities for enhanced security analysis.
// 
// 