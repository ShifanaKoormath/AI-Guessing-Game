const express = require("express");
const router = express.Router();
const knowledgeBase = require("../data/knowledgeBase.json");
const { selectBestQuestion } = require("../logic/decisionEngine");

const MAX_QUESTIONS = 15;
let gameState = null;

// ---------- START GAME ----------
router.post("/start", (req, res) => {
  gameState = {
    phase: "category",
    remainingObjects: [...knowledgeBase.objects],
    askedAttributes: [],
    currentAttribute: null,
    questionCount: 0,
    categoryStep: 0
  };

  return res.json({
    question: "Is it a living thing?",
    questionNumber: 1
  });
});

// ---------- ANSWER ----------
router.post("/answer", (req, res) => {
  if (!gameState) {
    return res.status(400).json({ message: "Game not started" });
  }

  const answer = req.body.answer === true;

  // ================= CATEGORY PHASE =================
  if (gameState.phase === "category") {
    gameState.questionCount++;

    // Step 1: Living?
    if (gameState.categoryStep === 0) {
      if (answer) {
        // Living → Animal
        gameState.remainingObjects = gameState.remainingObjects.filter(
          obj => obj.category === "Animal"
        );
        gameState.phase = "attributes";
      } else {
        // Not living → ask food
        gameState.categoryStep = 1;
        return res.json({
          question: "Is it food?",
          questionNumber: gameState.questionCount + 1
        });
      }
    }

    // Step 2: Food? (only if NOT living)
    else if (gameState.categoryStep === 1) {
      if (answer) {
        gameState.remainingObjects = gameState.remainingObjects.filter(
          obj => obj.category === "Food"
        );
      } else {
        gameState.remainingObjects = gameState.remainingObjects.filter(
          obj => obj.category === "Object"
        );
      }
      gameState.phase = "attributes";
    }

    // Move to attribute phase
    const attribute = selectBestQuestion(
      gameState.remainingObjects,
      gameState.askedAttributes
    );

    if (!attribute) {
      return res.json({
        status: "success",
        guess: gameState.remainingObjects[0]?.name || "Unknown"
      });
    }

    gameState.currentAttribute = attribute;
    gameState.askedAttributes.push(attribute);
    gameState.questionCount++;

    return res.json({
      question: `Is it ${attribute}?`,
      questionNumber: gameState.questionCount
    });
  }

  // ================= ATTRIBUTE PHASE =================
  const attr = gameState.currentAttribute;

  gameState.remainingObjects = gameState.remainingObjects.filter(
    obj => obj.attributes[attr] === answer
  );

  // Exact match
  if (gameState.remainingObjects.length === 1) {
    return res.json({
      status: "success",
      guess: gameState.remainingObjects[0].name
    });
  }

  // Question limit
  if (gameState.questionCount >= MAX_QUESTIONS) {
    return res.json({
      status: "success",
      guess: gameState.remainingObjects[0]?.name || "Unknown"
    });
  }

  const nextAttribute = selectBestQuestion(
    gameState.remainingObjects,
    gameState.askedAttributes
  );

  if (!nextAttribute) {
    return res.json({
      status: "success",
      guess: gameState.remainingObjects[0]?.name || "Unknown"
    });
  }

  gameState.currentAttribute = nextAttribute;
  gameState.askedAttributes.push(nextAttribute);
  gameState.questionCount++;

  return res.json({
    question: `Is it ${nextAttribute}?`,
    questionNumber: gameState.questionCount,
    remaining: gameState.remainingObjects.length
  });
});

module.exports = router;
