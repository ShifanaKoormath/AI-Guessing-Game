


#  AI Guessing Game (Rule-Based Expert System)

A web-based AI guessing game where the system identifies an object the user is thinking of by asking a sequence of **yes / no / not sure** questions.

This project is **not machine-learning based**.
It is a **deterministic, rule-based expert system** built using a structured Knowledge Base and formal reasoning logic.

---

## 📌 Key Idea

If the object exists in the Knowledge Base and the user answers consistently,
👉 **the system will always guess correctly**.

If the object is not in the Knowledge Base,
👉 the system behaves honestly and may guess with low confidence.

---

## 🧠 System Architecture

### Backend

* **Node.js + Express**
* Rule-based decision engine
* Structured Knowledge Base (JSON)
* Formal **separability validation**

### Frontend

* **React**
* Minimal UI
* Focus on question clarity and reasoning flow

---

## 🗂 Knowledge Base Design

The Knowledge Base (KB) is divided into **three top-level categories**:

* **Animal**
* **Food**
* **Object**

Each object contains:

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
* Human-answerable questions
* No repeated or looping questions
* Category locking to prevent cross-domain confusion
* Honest confidence scoring
* Provable correctness via validation scripts

---

## 🔒 Category Locking

The system starts with **base category questions**:

1. Is it a living thing?
2. Is it food?
3. Otherwise → Object

Once a category is determined:

* The category is **locked**
* Cross-category questions are permanently blocked
* Only relevant attributes are considered

This prevents illogical flows like:

> “Is it an animal?” → “Is it electronic?”

---

## 🤷 Handling “Not Sure” Answers

### Allowed

* Physical traits (e.g., has horns, has fur)
* Size, texture, form
* Secondary attributes

### Not Allowed

* Base category questions

If the user answers **“Not sure”** to a base category:

* The system asks for clarification once
* If ambiguity persists, the game **ends gracefully**

This prevents undefined reasoning.

---

## 🧪 Separability Validation

A custom script verifies that **every pair of objects in the same category is distinguishable**.

### Script

```bash
node scripts/checkSeparability.js
```

### Purpose

* Detects indistinguishable objects
* Forces addition of **minimal, meaningful discriminators**
* Prevents false confidence

Example fixes:

* Rice ↔ Chapati → `isGrainDish` vs `isBreadType`
* Refrigerator ↔ Microwave → `isForCooling` vs `isForHeating`
* Chair ↔ Table → `usedForSitting` vs `usedForPlacingItems`

---

## 📈 Knowledge Base Expansion Strategy

The KB is expanded **horizontally**, not vertically.

* Add similar objects first
* Let validation reveal missing discriminators
* Add only **human-understandable attributes**
* Re-validate after every expansion

This prevents:

* Early guessing
* One-object “buckets”
* Unrealistic attributes

---

## 🧪 Recommended Tests

* Base category ambiguity test
* Category lock regression test
* Repeated “Not sure” test
* Dense cluster test (Pizza / Burger / Sandwich)
* Near-twin objects (Chair vs Table)
* Wrong guess recovery
* Unknown object behavior

---

## ⚠️ Limitations

* No learning or self-updating KB
* No NLP or free-text input
* Requires honest user responses
* Unknown objects may lead to incorrect guesses (by design)

---

## 🎓 Academic Relevance

This project demonstrates:

* Expert system design
* Knowledge engineering
* Deterministic reasoning
* Formal validation
* UX-aware system logic

It is suitable for:

* AI fundamentals
* Knowledge-based systems
* Rule-based reasoning coursework

---

## 🚀 How to Run

### Backend

```bash
cd backend
npm install
node scripts/generateKnowledgeBase.js
node scripts/checkSeparability.js
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🧾 Final Note

This project prioritizes **correctness, explainability, and honesty** over flashy AI claims.

It behaves predictably, fails safely, and can be formally validated —
which is exactly how a real expert system should work.

---


