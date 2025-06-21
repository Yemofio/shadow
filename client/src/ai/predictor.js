import * as tf from '@tensorflow/tfjs';

let model;
const THRESHOLD = 0.9;

// Load pre-trained model from GitHub Pages
export async function loadModel() {
  model = await tf.loadLayersModel('/assets/model.json');
}

// Score API/command requests (0=normal, 1=malicious)
export function predict(data) {
  const input = tf.tensor2d([Object.values(data)]);
  const score = model.predict(input).dataSync()[0];
  return { score, isMalicious: score >= THRESHOLD };
}
