# 🤖 AI Guessing Game (Rule-Based Expert System)

An interactive **rule-based AI guessing game** where the system asks a sequence of yes/no questions and attempts to guess what the user is thinking of.

The project demonstrates **symbolic AI**, **decision-tree reasoning**, and **human-like problem solving** without using machine learning.

---

## 📌 Project Overview

The AI Guessing Game works similarly to classic “20 Questions” systems.

The user thinks of an:
- 🐾 Animal  
- 🍎 Food  
- 🪑 Object  

The system:
1. Identifies the **category**
2. Asks **attribute-based questions**
3. Narrows down possibilities intelligently
4. Makes a **best-effort guess** within a fixed number of questions

This project focuses on **explainability and logic**, not prediction.

---

## 🧠 Key Concepts Used

- Symbolic AI (Rule-Based Reasoning)
- Decision Trees
- Attribute Elimination
- Expert System Design
- Human-aligned Question Flow
- Frontend–Backend Separation

---

## ✨ Features Implemented (v1.0)

- ✅ Category-first reasoning (Living → Food → Object)
- ✅ Large knowledge base (156 total entries)
- ✅ Intelligent question selection (balanced splits)
- ✅ No meaningless or repeated questions
- ✅ Graceful handling of ambiguity
- ✅ Friendly, conversational UI
- ✅ Smooth transitions (no flashing questions)
- ✅ Deterministic and explainable logic

---

## 📊 Knowledge Base Summary

The knowledge base is **programmatically generated** and contains:

| Category | Entries |
|--------|--------|
| Animals | 52 |
| Foods   | 52 |
| Objects | 52 |
| **Total** | **156** |

Each entry is defined using a **shared attribute schema** to ensure consistency.

---

## 🛠 Tech Stack

### Frontend
- React (Create React App)
- JavaScript (ES6)
- HTML & CSS
- Fetch API

### Backend
- Node.js
- Express.js
- JSON-based Knowledge Base
- Custom Decision Engine

---

## 📂 Project Structure

AI-Guessing-Game/
├── backend/
│ ├── data/
│ │ └── knowledgeBase.json
│ ├── logic/
│ │ └── decisionEngine.js
│ ├── routes/
│ │ └── gameRoutes.js
│ ├── server.js
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── App.js
│ │ └── App.css
│ └── package.json
│
└── README.md


---

## 🚀 Setup Instructions

### ✅ Prerequisites

- Node.js (v16 or higher recommended)
- npm
- Git

---
📥 Clone the Repository

To get a local copy of the project, run:

git clone https://github.com/ShifanaKoormath/AI-Guessing-Game.git
cd AI-Guessing-Game


This will download the complete frontend and backend codebase.

🔁 Keeping Your Local Copy Updated (Optional)

If you have already cloned the repository and want the latest changes:

git pull origin main


### 🔧 Backend Setup

```bash
cd backend
npm install
node server.js

Backend will start at:

http://localhost:5000

🎨 Frontend Setup
cd frontend
npm install
npm start


Frontend will start at:

http://localhost:3000

🎮 How to Play

Open the application in the browser

Read the introduction and click Start Game

Think of an animal, food, or object

Answer questions using Yes / No

Let the AI guess your object

Play again to try different items

🧠 How the AI Thinks

Category Phase

Is it a living thing?

If not, is it food?

Otherwise, it is treated as an object

Attribute Phase

The decision engine selects attributes that best split remaining objects

Previously asked attributes are never repeated

Guessing Strategy

Guess when only one object remains

Or when no distinguishing attributes are left

Or when the question limit is reached

This ensures logical consistency and avoids infinite loops.

⚠️ Known Limitations

The system is rule-based (no learning during gameplay)

Similar objects (e.g., Lion vs Tiger) may be confused

Failure is possible when objects share identical attributes

These are expected limitations of symbolic AI systems and are handled gracefully.

🔮 Future Enhancements

Learning mode (add new objects dynamically)

Explanation of why a guess was made

Dark mode UI

Visual display of remaining possibilities

Sound or typing animations for interaction

📜 License


This project is intended for educational and academic use.
