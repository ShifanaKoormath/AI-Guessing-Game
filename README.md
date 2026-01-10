AI Guessing Game
A Rule-Based Expert System (Symbolic AI)

An interactive AI guessing game built using rule-based reasoning where the system asks structured questions and attempts to infer what the user is thinking of.

This project demonstrates symbolic AI, decision-tree reasoning, and human-like problem solving — without machine learning.

📌 Project Overview

The AI Guessing Game works on the same principle as classic “20 Questions” expert systems.

The user thinks of an:

🐾 Animal

🍎 Food

🪑 Object

The system then:

Identifies the broad category

Asks attribute-based questions

Progressively narrows the search space

Makes a best-effort guess

Accepts feedback and tries again if needed

The focus is on logic, transparency, and explainability, not prediction or training.

🧠 Core AI Concepts Demonstrated

Symbolic AI (Rule-Based Expert Systems)

Decision Tree Reasoning

Attribute Elimination

Search Space Reduction

Confidence Estimation from Uncertainty

Human-aligned Question Flow

Deterministic Inference (No randomness, no ML)

✨ Features Implemented (v1.0)

✅ Category-first reasoning (Living → Food → Object)

✅ Large, structured knowledge base (156 entries)

✅ Intelligent question selection (balanced attribute splits)

✅ No repeated or meaningless questions

✅ “Not sure” option for uncertain user responses

✅ Honest confidence estimation based on remaining possibilities

✅ Retry logic when the first guess is wrong

✅ Friendly, conversational UI

✅ Smooth, stable transitions (no flashing or layout jumps)

✅ Fully explainable and deterministic logic

📊 Knowledge Base Summary

The knowledge base is programmatically generated and structured using shared attribute schemas.

Category	Entries
Animals	52
Foods	52
Objects	52
Total	156

Each entity is represented as:

A category

A fixed set of boolean attributes

This ensures consistency and predictable reasoning.

🛠 Tech Stack
Frontend

React (Create React App)

JavaScript (ES6)

HTML & CSS

Fetch API

Backend

Node.js

Express.js

JSON-based Knowledge Base

Custom Decision & Confidence Engines

📂 Project Structure
AI-Guessing-Game/
├── backend/
│   ├── data/
│   │   └── knowledgeBase.json
│   ├── logic/
│   │   ├── decisionEngine.js
│   │   ├── confidenceEngine.js
│   │   └── questionFormatter.js
│   ├── routes/
│   │   └── gameRoutes.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
└── README.md

🚀 Setup Instructions
✅ Prerequisites

Node.js (v16 or higher recommended)

npm

Git





📥 Clone the Repository

To get a local copy of the project, (In Vs code/any coding platform Terminal),Run this command:

git clone https://github.com/ShifanaKoormath/AI-Guessing-Game.git
cd AI-Guessing-Game


This will download the complete frontend and backend codebase.

🔧 Backend Setup

cd backend
npm install
node server.js

Backend runs at:

http://localhost:5000

🎨 Frontend Setup
cd frontend
npm install
npm start


Frontend runs at:

http://localhost:3000

🎮 How to Play

Open the app in your browser

Click Start Game

Think of an animal, food, or object

Answer using:

Yes

No

Not sure (optional)

Review the AI’s guess and confidence

Confirm if it was correct

Let the AI retry if it was wrong

🧠 How the AI Thinks
1️⃣ Category Phase

“Is it a living thing?”

If not: “Is it food?”

Otherwise treated as an object

2️⃣ Attribute Phase

Selects attributes that best divide remaining possibilities

Previously asked attributes are never repeated

Skipped attributes (“Not sure”) do not affect filtering

3️⃣ Guessing Strategy

The AI makes a guess when:

Only one object remains

No useful attributes are left

The question limit is reached

4️⃣ Confidence Estimation

Confidence is calculated as:

confidence = 1 / number of remaining possible objects


This avoids false certainty and reflects real uncertainty.

5️⃣ Feedback & Retry

If the guess is wrong, the AI removes it and tries the next best option

This continues until:

The guess is correct, or

All possibilities are exhausted

⚠️ Known Limitations

Rule-based system (no learning during gameplay)

Similar objects (e.g., Lion vs Tiger) may be confused

Objects with identical attributes cannot be distinguished

These are expected limitations of symbolic AI and are handled gracefully.

🔮 Future Enhancements

Learning mode (add new objects dynamically)

Explanation of why a guess was made

Confidence visualization

Accessibility improvements

Optional sound or typing indicators

📜 License

This project is intended for educational and academic use.

Final note (important)

This README now accurately reflects the sophistication of your system.
It reads like an expert system project, not a toy guessing game.