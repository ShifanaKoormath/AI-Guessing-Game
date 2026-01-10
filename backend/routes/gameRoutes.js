const express = require("express");
const router = express.Router();

const knowledgeBase = require("../data/knowledgeBase.json");
const { selectBestQuestion } = require("../logic/decisionEngine");
const { selectBestGuess } = require("../logic/confidenceEngine");
const { formatQuestion } = require("../logic/questionFormatter");

const MAX_QUESTIONS = 15;
let gameState = null;

// ---------- START ----------
router.post("/start", (req, res) => {
  gameState = {
    phase: "category",
    remainingObjects: [...knowledgeBase.objects],
    askedAttributes: [],
    currentAttribute: null,
    questionCount: 0,
    categoryStep: 0,
    lastConfidence: 0
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

  const answer = req.body.answer; // true | false | null

  // ================= CATEGORY PHASE =================
  if (gameState.phase === "category") {
    gameState.questionCount++;

    if (gameState.categoryStep === 0) {
      if (answer === true) {
        gameState.remainingObjects =
          gameState.remainingObjects.filter(o => o.category === "Animal");
        gameState.phase = "attributes";
      } else if (answer === false) {
        gameState.categoryStep = 1;
        return res.json({
          question: "Is it food?",
          questionNumber: gameState.questionCount + 1
        });
      }
    } else {
      if (answer === true) {
        gameState.remainingObjects =
          gameState.remainingObjects.filter(o => o.category === "Food");
      } else if (answer === false) {
        gameState.remainingObjects =
          gameState.remainingObjects.filter(o => o.category === "Object");
      }
      gameState.phase = "attributes";
    }
  }

  // ================= ATTRIBUTE PHASE =================

  // Apply previous answer ONLY if user was sure
  if (
    gameState.phase === "attributes" &&
    gameState.currentAttribute &&
    answer !== null
  ) {
    gameState.remainingObjects =
      gameState.remainingObjects.filter(
        obj => obj.attributes[gameState.currentAttribute] === answer
      );
  }

  // Guess if done
  if (
    gameState.phase === "attributes" &&
    (gameState.remainingObjects.length === 1 ||
      gameState.questionCount >= MAX_QUESTIONS)
  ) {
    const guess = selectBestGuess(gameState.remainingObjects);
    gameState.lastConfidence = guess.confidence;

    return res.json({
      status: "guess",
      guess: guess.name,
      confidence: guess.confidence
    });
  }

  // Ask next attribute
  if (gameState.phase === "attributes") {
    const nextAttr = selectBestQuestion(
      gameState.remainingObjects,
      gameState.askedAttributes
    );

    if (!nextAttr) {
      const guess = selectBestGuess(gameState.remainingObjects);
      gameState.lastConfidence = guess.confidence;

      return res.json({
        status: "guess",
        guess: guess.name,
        confidence: guess.confidence
      });
    }

    gameState.currentAttribute = nextAttr;

    // Only mark as asked if user answered yes/no
    if (answer !== null) {
      gameState.askedAttributes.push(nextAttr);
    }

    gameState.questionCount++;

    return res.json({
      question: formatQuestion(nextAttr),
      questionNumber: gameState.questionCount
    });
  }
});

// ---------- FEEDBACK ----------
router.post("/feedback", (req, res) => {
  const { correct } = req.body;

  if (!gameState) {
    return res.status(400).json({ message: "No active game" });
  }

  // If guess was correct → end game
  if (correct) {
    gameState = null;
    return res.json({
      status: "done",
      message: "🎉 Nice! That means my reasoning worked well."
    });
  }

  // Guess was wrong → remove last guessed object
  if (gameState.remainingObjects.length > 0) {
    gameState.remainingObjects.shift(); // remove previous guess
  }

  // If no more objects, give up gracefully
  if (gameState.remainingObjects.length === 0) {
    gameState = null;
    return res.json({
      status: "done",
      message:
        "😅 I’ve run out of good guesses. That one tricked me!"
    });
  }

  // Make next best guess
  const nextGuess = selectBestGuess(gameState.remainingObjects);
  gameState.lastConfidence = nextGuess.confidence;

  return res.json({
    status: "retry",
    guess: nextGuess.name,
    confidence: nextGuess.confidence,
    message:
      "Alright, let me try again. How about this?"
  });
});



module.exports = router;
