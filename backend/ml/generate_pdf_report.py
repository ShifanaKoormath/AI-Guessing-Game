import json
import os
import pandas as pd
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4

BASE_DIR = os.path.dirname(__file__)
log_path = os.path.join(BASE_DIR, "..","logs", "gameLogs.json")

with open(log_path) as f:
    logs = json.load(f)

df = pd.DataFrame(logs)

accuracy = df["correct_guess"].mean()
avg_questions = df["questions_asked"].mean()
total_games = len(df)

styles = getSampleStyleSheet()

report_path = os.path.join(BASE_DIR, "AI_Guessing_System_Evaluation_Report.pdf")

story = []

story.append(Paragraph("AI Guessing System Evaluation Report", styles['Title']))
story.append(Spacer(1,20))

story.append(Paragraph("Simulation Metrics", styles['Heading2']))
story.append(Spacer(1,10))

story.append(Paragraph(f"Total Simulated Games: {total_games}", styles['BodyText']))
story.append(Paragraph(f"Accuracy: {accuracy:.3f}", styles['BodyText']))
story.append(Paragraph(f"Average Questions per Game: {avg_questions:.2f}", styles['BodyText']))

story.append(Spacer(1,25))

# --------------------------
# Attribute Importance
# --------------------------

attribute_counts = {}

for attrs in df["attributes_used"]:
    for a in attrs:
        attribute_counts[a] = attribute_counts.get(a,0)+1

attr_df = pd.DataFrame(
    list(attribute_counts.items()),
    columns=["Attribute","Usage"]
).sort_values("Usage",ascending=False).head(10)

story.append(Paragraph("Top Informative Attributes", styles['Heading2']))
story.append(Spacer(1,10))

table_data = [["Attribute","Times Used"]]

for _,row in attr_df.iterrows():
    table_data.append([row["Attribute"], int(row["Usage"])])

story.append(Table(table_data))
story.append(Spacer(1,25))

# --------------------------
# Hardest Objects
# --------------------------

failures = df[df["correct_guess"] == False]

hardest = (
    failures.groupby("actual_object")
    .size()
    .sort_values(ascending=False)
    .head(5)
)

story.append(Paragraph("Hardest Objects To Guess", styles['Heading2']))
story.append(Spacer(1,10))

table_data = [["Object","Failures"]]

for obj,count in hardest.items():
    table_data.append([obj,int(count)])

story.append(Table(table_data))
story.append(Spacer(1,25))

# --------------------------
# Confusion pairs
# --------------------------

confusions = df[df["correct_guess"] == False]

pairs = (
    confusions.groupby(["actual_object","guessed_object"])
    .size()
    .sort_values(ascending=False)
    .head(5)
)

story.append(Paragraph("Most Common Confusion Pairs", styles['Heading2']))
story.append(Spacer(1,10))

table_data = [["Actual","Guessed","Count"]]

for (actual,guess),count in pairs.items():
    table_data.append([actual,guess,int(count)])

story.append(Table(table_data))
story.append(Spacer(1,30))

# --------------------------
# Graphs
# --------------------------

story.append(Paragraph("Evaluation Visualizations", styles['Heading2']))
story.append(Spacer(1,15))

# --------------------------
# Graphs
# --------------------------

story.append(Paragraph("Evaluation Visualizations", styles['Heading2']))
story.append(Spacer(1,15))

graphs = [
    "attribute_importance.png",
    "confusion_matrix.png",
    "question_distribution.png"
]

for g in graphs:

    # graphs are saved in backend/
    img_path = os.path.join(BASE_DIR, "..", g)

    if os.path.exists(img_path):
        story.append(Image(img_path, width=450, height=300))
        story.append(Spacer(1,20))
    else:
        print("Graph not found:", img_path)

for g in graphs:
    img_path = os.path.join(BASE_DIR, g)

    if os.path.exists(img_path):
        story.append(Image(img_path,width=450,height=300))
        story.append(Spacer(1,20))

doc = SimpleDocTemplate(report_path,pagesize=A4)
doc.build(story)

print("PDF report generated:")
print(report_path)