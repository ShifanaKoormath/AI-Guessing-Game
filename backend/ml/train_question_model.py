import json
import pickle
import numpy as np
from sklearn.linear_model import LinearRegression

# Load question statistics
with open("../data/questionStats.json") as f:
    stats = json.load(f)

X = []
y = []
attributes = []

for attr, data in stats.items():
    asked = data["asked"]
    if asked == 0:
        continue

    answered_not_sure = data["answeredNotSure"]
    total_reduction = data["totalReduction"]
    success = data["gamesLedToCorrectGuess"]

    not_sure_rate = answered_not_sure / asked
    avg_reduction = total_reduction / asked
    success_rate = success / asked

    # Features
    X.append([
        asked,
        not_sure_rate,
        avg_reduction,
        success_rate
    ])

    # Target (effectiveness score)
    effectiveness = avg_reduction * (1 - not_sure_rate) * (1 + success_rate)
    y.append(effectiveness)

    attributes.append(attr)

X = np.array(X)
y = np.array(y)

model = LinearRegression()
model.fit(X, y)

# Save model
with open("question_model.pkl", "wb") as f:
    pickle.dump({
        "model": model,
        "attributes": attributes
    }, f)

print("✅ Question effectiveness ML model trained and saved")
