import json
import pickle
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

stats_path = os.path.join(BASE_DIR, "..", "data", "questionStats.json")
model_path = os.path.join(BASE_DIR, "question_model.pkl")

with open(stats_path) as f:
    stats = json.load(f)

with open(model_path, "rb") as f:
    saved = pickle.load(f)

model = saved["model"]

weights = {}

for attr, data in stats.items():
    asked = data["asked"]
    if asked == 0:
        continue

    not_sure_rate = data["answeredNotSure"] / asked
    avg_reduction = data["totalReduction"] / asked
    success_rate = data["gamesLedToCorrectGuess"] / asked

    X = np.array([[asked, not_sure_rate, avg_reduction, success_rate]])
    pred = model.predict(X)[0]

    weights[attr] = max(round(float(pred), 3), 0.1)

print(json.dumps(weights))
