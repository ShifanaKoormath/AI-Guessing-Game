import json
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Get script directory
BASE_DIR = os.path.dirname(__file__)

# Build path safely
log_path = os.path.join(BASE_DIR, "..", "logs", "gameLogs.json")

with open(log_path) as f:
    logs = json.load(f)

df = pd.DataFrame(logs)

accuracy = df["correct_guess"].mean()
avg_questions = df["questions_asked"].mean()

print("Accuracy:", accuracy)
print("Avg Questions:", avg_questions)

# -------------------------
# ATTRIBUTE IMPORTANCE
# -------------------------
attribute_counts = {}

for attrs in df["attributes_used"]:
    for a in attrs:
        attribute_counts[a] = attribute_counts.get(a, 0) + 1

attr_df = pd.DataFrame(
    list(attribute_counts.items()),
    columns=["attribute","count"]
).sort_values("count",ascending=False).head(15)

plt.figure(figsize=(10,6))
sns.barplot(data=attr_df,x="count",y="attribute")
plt.title("Top Informative Attributes")
plt.tight_layout()
plt.savefig("attribute_importance.png")

# -------------------------
# CONFUSION MATRIX
# -------------------------
conf_df = df.dropna(subset=["actual_object","guessed_object"])

matrix = pd.crosstab(
    conf_df["actual_object"],
    conf_df["guessed_object"]
)

plt.figure(figsize=(10,8))
sns.heatmap(matrix,annot=True,fmt="d",cmap="Blues")
plt.title("Confusion Matrix")
plt.tight_layout()
plt.savefig("confusion_matrix.png")

# -------------------------
# QUESTION DISTRIBUTION
# -------------------------
plt.figure(figsize=(8,6))
sns.histplot(df["questions_asked"],bins=15)
plt.title("Questions Needed per Game")
plt.xlabel("Questions")
plt.ylabel("Games")
plt.tight_layout()
plt.savefig("question_distribution.png")

print("Evaluation graphs saved.")