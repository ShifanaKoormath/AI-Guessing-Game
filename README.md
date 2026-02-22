
# 🤖 AI Guessing Game

## Rule-Based Expert System with ML-Assisted Optimization

A web-based AI guessing game where the system identifies an object the user is thinking of by asking a sequence of **Yes / No / Not Sure** questions.

The core is a **deterministic rule-based expert system** built on a structured Knowledge Base.
A **machine learning module acts only as an assistive optimization layer** to improve question ordering based on interaction history.

---

## 📌 Key Idea

* If the object exists in the Knowledge Base and the user answers consistently,
  👉 **the system will always converge to the correct guess.**

* If the object does not exist,
  👉 the system behaves honestly, may fail, and can **learn safely through user-guided Learning Mode.**

The system **never fabricates knowledge** and **never modifies the KB automatically.**

---

## 🧠 System Architecture

### Backend

* Node.js + Express
* Deterministic rule-based decision engine
* JSON Knowledge Base
* Category locking
* Attribute-based elimination
* Separability validation
* **Guided Learning Mode (safe KB expansion)**
* **ML-assisted question prioritization**

### Frontend

* React
* Deterministic interaction flow
* Explicit support for **Yes / No / Not Sure**
* Separate Learning Mode UI

---

## 🗂 Knowledge Base Design

The KB is divided into three categories:

* **Animal**
* **Food**
* **Object**

Each object contains:

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

Attributes are:

* Boolean (true / false / null)
* Occasionally numeric (e.g., `numberOfWheels`)

---

## 🔑 Core Design Principles

* Deterministic reasoning (no randomness)
* No fabricated knowledge
* Human-answerable attributes only
* Category locking
* Explicit uncertainty handling
* No looping or repeated questions
* Honest confidence scoring
* ML used **only for optimization**
* KB updated **only through controlled learning**

---

## 🔒 Category Locking

Game begins with base classification:

1. Is it a living thing? → Animal
2. Is it food? → Food
3. Otherwise → Object

Once determined:

* Category is **locked**
* Cross-category attributes blocked
* Reasoning stays consistent

---

## 🤷 Handling “Not Sure”

Allowed for:

* Secondary physical traits
* Size / texture / behavior

Not allowed for:

* Base category questions

Repeated ambiguity ends the game cleanly.

---

## 🧪 Separability Validation

Script:

```bash
node scripts/checkSeparability.js
```

Ensures:

* Every pair of objects in a category is distinguishable
* No duplicate or indistinguishable entries
* Prevents false confidence

---

## 📚 Learning Mode (Stable Version)

Learning Mode activates **only when the system fails to guess correctly**.

### Flow

1. System fails → asks user for permission to learn
2. User provides object name
3. System asks remaining attributes using human-friendly questions
4. Previously known answers from gameplay are reused
5. Mutual-exclusion & implication rules auto-applied
6. Full attribute vector constructed
7. Duplicate & indistinguishable validation performed
8. Object safely written to KB (atomic write)

### Safety Guarantees

* Category inferred from gameplay (never re-asked)
* KB never corrupted
* Duplicate objects prevented
* Indistinguishable objects rejected
* Partial answers allowed
* Unknown attributes normalized to `null`
* No automatic learning outside Learning Mode

---

## 🤖 Machine Learning Integration

### Purpose

ML **does NOT guess objects.**
It improves **question ordering efficiency.**

### What ML Learns

* Which attributes reduce search space best
* Which attributes users answer confidently
* Which attributes contribute to correct guesses

### Model

* Regression-based
* Trained on gameplay interaction logs
* Outputs **attribute effectiveness weights**

### System Role

* ML suggests question priority
* Rule-based engine remains authoritative
* Final reasoning always deterministic

Hybrid approach:

> Rule-Based Reasoning + ML Optimization

---

## 🔄 Automatic Batch ML Retraining

Retraining occurs after a fixed number of completed games (e.g., every 10):

* Interaction logs collected during gameplay
* Model retrained asynchronously
* Gameplay never blocked
* KB remains unchanged

Ensures:

* Stable learning
* No overfitting
* Explainable improvement

---

## 🧪 What the System Logs

* Attribute usage frequency
* User certainty
* Candidate reduction
* Contribution to successful guesses

Used only for ML optimization — **never for automatic KB edits.**

---

## 📈 Knowledge Base Expansion Strategy

* Expand horizontally (similar objects first)
* Let separability reveal missing attributes
* Add only human-understandable attributes
* Validate after every expansion

Avoids:

* One-object categories
* Artificial attributes
* Premature guessing

---

## ⚠️ Limitations

* No NLP / free-text reasoning
* Requires honest user responses
* Unknown objects may still fail (by design)
* ML effectiveness depends on interaction volume
* Not a generative AI system

---

## 🎓 Academic Relevance

Demonstrates:

* Expert system design
* Knowledge engineering
* Hybrid AI architecture
* Deterministic reasoning under uncertainty
* Human-guided learning
* Formal validation & correctness

---

## 🚀 Run the Project

### Backend

```bash
cd backend
npm install
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

This project prioritizes:

* Correctness
* Explainability
* Controlled learning
* Deterministic reasoning

It demonstrates how **machine learning can enhance — not replace — a well-designed expert system.**

---
