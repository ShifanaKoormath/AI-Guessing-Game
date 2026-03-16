# AI Guessing System — Evaluation & Simulation Module

## Overview

This module evaluates the performance of the AI Guessing System using automated simulations, logging, statistical analysis, and visualization.

Instead of manually testing the system, the evaluation module runs thousands of simulated games against the knowledge base and measures how efficiently and accurately the AI identifies objects.

The module produces:

* Quantitative performance metrics
* Attribute importance analysis
* Confusion matrix of prediction errors
* Question efficiency distribution
* A compiled PDF evaluation report

This approach mirrors how AI systems are evaluated in research environments.

---

# Evaluation Pipeline

The evaluation process follows a structured pipeline:

Knowledge Base
→ Automated Game Simulation
→ Game Logging
→ Statistical Analysis
→ Visualization
→ PDF Evaluation Report

Each step is automated and reproducible.

---

# Simulation Engine

The simulation system repeatedly plays the guessing game automatically using objects from the knowledge base as targets.

For each simulation:

1. A random object from the knowledge base is selected.
2. The decision engine chooses the best attribute question.
3. The system filters possible objects based on the answer.
4. The process repeats until:

   * Only one object remains, or
   * The maximum question limit is reached.

The system then makes a final guess.

Simulation statistics are logged for analysis.

---

# Logged Game Data

Each simulated game records the following information:

game_id
timestamp
actual_object
guessed_object
questions_asked
objects_remaining
correct_guess
attributes_used
ml_used

Example:

```
{
  "actual_object": "Orange",
  "guessed_object": "Orange",
  "questions_asked": 6,
  "correct_guess": true,
  "attributes_used": ["isFruit","hasSeeds","isRound"]
}
```

These logs are stored in:

```
backend/gameLogs.json
```

---

# Evaluation Metrics

The system calculates several important AI performance metrics.

### Accuracy

Measures how often the system correctly identifies the object.

Accuracy = Correct guesses / Total games

Example:

```
Accuracy: 95.1%
```

---

### Average Questions

Measures how many questions the system requires to reach a guess.

Lower values indicate more efficient reasoning.

Example:

```
Average Questions: 5.37
```

---

### Candidate Reduction

Measures how effectively each question reduces the number of possible objects.

Example:

```
Average Reduction Per Question: ~50%
```

This indicates the decision engine selects highly informative questions.

---

# Attribute Importance

The system analyzes which attributes are used most frequently across all simulations.

Example:

```
isFruit
isMammal
fixedInPlace
hasSeeds
```

Attributes with high usage typically provide strong candidate reduction.

---

# Confusion Matrix

The confusion matrix shows which objects are frequently mistaken for others.

Example:

```
Actual → Predicted
Kiwi → Mango
Guava → Apple
Pomegranate → Watermelon
```

This usually occurs when objects share similar attribute sets.

Such cases highlight opportunities to improve the knowledge base by adding discriminating attributes.

---

# Visualization Outputs

The evaluation generates the following graphs:

### Attribute Importance

Shows which attributes the system uses most often.

```
attribute_importance.png
```

---

### Confusion Matrix

Displays prediction errors between objects.

```
confusion_matrix.png
```

---

### Question Distribution

Shows how many questions are typically required to reach a guess.

```
question_distribution.png
```

---

# Automated Evaluation Report

A PDF report is automatically generated containing:

* Evaluation metrics
* Attribute importance table
* Hardest objects to guess
* Confusion pairs
* Visualization charts

Output file:

```
backend/ml/AI_Guessing_System_Evaluation_Report.pdf
```

---

# How to Run the Evaluation

All commands should be executed from the `backend` directory.

---

## Step 1 — Run Simulations

Runs automated games against the knowledge base.

```
node simulateGames.js
```

This generates game logs in:

```
gameLogs.json
```

Recommended simulations:

```
10,000 games
```

---

## Step 2 — Generate Evaluation Graphs

```
python ml/generate_evaluation_report.py
```

This produces:

```
attribute_importance.png
confusion_matrix.png
question_distribution.png
```

Saved in:

```
backend/
```

---

## Step 3 — Generate PDF Report

```
python ml/generate_pdf_report.py
```

Output:

```
backend/ml/AI_Guessing_System_Evaluation_Report.pdf
```

---

# Required Dependencies

Python packages:

```
matplotlib
seaborn
pandas
reportlab
```

Install with:

```
pip install matplotlib seaborn pandas reportlab
```

---

# Example Evaluation Result

Example results from a 10,000 game simulation:

```
Accuracy: 95.1%
Average Questions: 5.37
Average Candidate Reduction: 49.8%
```

This indicates the AI is able to identify objects efficiently with a near-optimal question strategy.

---

# Interpretation

The evaluation demonstrates that:

* The decision engine selects high-information questions.
* Machine learning improves attribute prioritization.
* Most objects can be identified within 4–6 questions.
* Errors mainly occur when objects share identical attributes.

Improving the knowledge base with more discriminating attributes can further improve accuracy.

---

# Summary

This evaluation module provides a complete AI testing framework including:

* Automated gameplay simulation
* Statistical performance measurement
* Visualization of decision behavior
* Research-style evaluation reporting

This allows the AI Guessing System to be analyzed, validated, and improved using data-driven methods.
