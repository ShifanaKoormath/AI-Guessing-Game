Good — the structure you have is already solid.
What it needs now is **truthful polishing** to reflect what the system has *become*:

* still a **rule-based expert system**
* now with a **clear, bounded ML component**
* without overselling or contradicting yourself

Below is a **clean, evaluator-ready polished README**.
I’ve **kept your voice and intent**, corrected contradictions, and **added ML properly** without hype.

You can replace your README with this.

---

# 🤖 AI Guessing Game

## Rule-Based Expert System with ML-Assisted Learning

A web-based AI guessing game where the system identifies an object the user is thinking of by asking a sequence of **yes / no / not sure** questions.

The core of the system is a **deterministic, rule-based expert system** built on a structured Knowledge Base.
A **machine learning module is integrated as an assistive layer** to improve question selection based on user interaction history.

---

## 📌 Key Idea

* If the object exists in the Knowledge Base and the user answers consistently,
  👉 **the system will always guess correctly**.

* If the object does not exist in the Knowledge Base,
  👉 the system behaves honestly, may guess with low confidence, and can learn from interaction.

The system **never fabricates knowledge**.

---

## 🧠 System Architecture

### Backend

* **Node.js + Express**
* Deterministic rule-based decision engine
* Structured Knowledge Base (JSON)
* Category locking & constraint enforcement
* **ML-assisted question prioritization**
* Formal **separability validation**

### Frontend

* **React**
* Minimal UI
* Focus on reasoning clarity and user certainty
* Explicit support for *Yes / No / Not Sure*

---

## 🗂 Knowledge Base Design

The Knowledge Base (KB) is divided into **three top-level categories**:

* **Animal**
* **Food**
* **Object**

Each entry contains:

* `name`
* `category`
* `attributes` (boolean / numeric)

Example:

```json
{
  "name": "Bicycle",
  "category": "Object",
  "attributes": {
    "isVehicle": true,
    "usesHumanPower": true,
    "hasPedals": true,
    "numberOfWheels": 2
  }
}
```

---

## 🔑 Core Design Principles

* Deterministic reasoning (no randomness)
* Human-answerable questions only
* No repeated or looping questions
* Category locking to prevent cross-domain confusion
* Explicit handling of uncertainty
* Honest confidence scoring
* Provable correctness via validation scripts
* ML used only as an **assistive optimization layer**

---

## 🔒 Category Locking

The system begins with base category identification:

1. Is it a living thing?
2. Is it food?
3. Otherwise → Object

Once determined:

* The category is **locked**
* Cross-category questions are blocked
* Only relevant attributes are considered

This prevents invalid flows such as:

> “Is it an animal?” → “Is it electronic?”

---

## 🤷 Handling “Not Sure” Answers

### Allowed for:

* Physical traits (e.g., has fur, has horns)
* Size, texture, form
* Secondary attributes

### Not allowed for:

* Base category questions

If the user answers **“Not sure”** for a base category:

* The system requests clarification once
* Persistent ambiguity ends the game gracefully

This ensures reasoning remains well-defined.

---

## 🧪 Separability Validation

A custom validation script ensures that **every pair of objects within the same category is distinguishable**.

### Script

```bash
node scripts/checkSeparability.js
```

### Purpose

* Detects indistinguishable objects
* Forces minimal, meaningful discriminators
* Prevents false confidence and early guessing

Example fixes:

* Rice ↔ Chapati → `isGrainDish` vs `isBreadType`
* Refrigerator ↔ Microwave → `isForCooling` vs `isForHeating`
* Chair ↔ Table → `usedForSitting` vs `usedForPlacingItems`

---

## 📈 Knowledge Base Expansion Strategy

The KB is expanded **horizontally**, not vertically:

* Add similar objects first
* Let separability checks reveal missing discriminators
* Add only **human-understandable attributes**
* Re-validate after every expansion

This avoids:

* One-object buckets
* Premature guessing
* Unrealistic attributes

---

## 🤖 Machine Learning Integration

### Purpose of ML

Machine Learning is **not used to guess objects**.
It is used to **optimize question selection**.

### What ML Learns

* How effective each attribute question is
* Based on:

  * How often it reduces the search space
  * How often users answer “Not sure”
  * How often it contributes to correct guesses

### ML Model

* Regression-based model
* Trained on interaction statistics collected during gameplay
* Outputs a **question effectiveness weight** for each attribute

### Role in the System

* ML predicts relative usefulness of questions
* The rule-based engine remains authoritative
* Final decisions are always deterministic

This creates a **hybrid AI system**:

> Rule-based reasoning + ML-assisted optimization

---
## 🔄 Automatic Batch-Based ML Retraining

The system supports **automatic batch-based retraining** of the machine learning model to ensure continuous improvement while maintaining stability.

### Why Batch Retraining?

Retraining the ML model after every single game can lead to:
- Overfitting on very small data samples
- Instability due to noisy or inconsistent user input
- Increased computational overhead during gameplay

To avoid this, the system uses **batch-based retraining**.

---

### How It Works

- The system logs user interactions during gameplay:
  - Attribute usage frequency
  - User certainty (Yes / No / Not Sure)
  - Reduction in candidate objects
  - Contribution to correct guesses

- After a **fixed number of completed games** (e.g., every 10 games):
  - The ML training script is triggered automatically
  - A new regression model is trained using accumulated interaction data
  - The updated model replaces the previous one seamlessly

- Retraining runs **asynchronously in the background**
  - Gameplay is never blocked
  - The expert system continues operating normally

---

### Role of Retraining in the System

- Retraining **does not modify the Knowledge Base**
- It only updates the ML model that predicts **question effectiveness**
- The rule-based decision engine remains authoritative
- ML acts strictly as an **assistive optimization layer**

This design ensures:
- Controlled learning
- Stable behavior
- Explainable adaptation over time

---

### Design Rationale

This approach follows best practices in hybrid AI systems by combining:
- Deterministic expert reasoning
- Human-in-the-loop interaction data
- Periodic machine learning updates

The result is a system that **learns safely without sacrificing correctness or predictability**.

## 🧪 Learning & Adaptation

During gameplay, the system logs:

* Attribute usage frequency
* User certainty
* Reduction in candidate objects
* Contribution to successful guesses

These logs are used to:

* Train the ML model
* Dynamically reorder future questions
* Reduce user confusion over time

The Knowledge Base itself is **never modified automatically**.

---

## 🧪 Recommended Tests

* Base category ambiguity test
* Category lock regression test
* Repeated “Not sure” handling
* Dense cluster test (Pizza / Burger / Sandwich)
* Near-twin object test (Chair vs Table)
* Wrong guess recovery
* ML behavior comparison (before vs after training)

---

## ⚠️ Limitations

* No free-text NLP reasoning
* No automatic KB self-modification
* Requires honest user responses
* Unknown objects may still be guessed incorrectly (by design)
* ML effectiveness depends on interaction history

---

## 🎓 Academic Relevance

This project demonstrates:

* Expert system design
* Knowledge engineering
* Hybrid AI architectures
* Deterministic reasoning with uncertainty
* Human-in-the-loop learning
* Formal validation techniques

Suitable for:

* AI fundamentals
* Knowledge-based systems
* Hybrid AI coursework
* Rule-based reasoning projects

---

## 🚀 How to Run

### Backend

```bash
cd backend
npm install
node tools/generateKnowledgeBase.js
node scripts/checkSeparability.js
node server.js
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🧾 Final Note

This project prioritizes **correctness, explainability, and controlled learning** over exaggerated AI claims.

The system is:

* Predictable
* Honest
* Validatable
* Academically defensible

It demonstrates how **machine learning can enhance**, not replace, a well-designed expert system.

---
