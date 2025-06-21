import tensorflow as tf
from sklearn.ensemble import IsolationForest
import joblib

# Train on normal API call logs (dummy example)
X_train = [...]  # Your historical logs
model = IsolationForest(contamination=0.01)
model.fit(X_train)

# Export for TensorFlow.js
tf.saved_model.save(model, "model")
joblib.dump(model, "model.pkl")  # For Workers KV
