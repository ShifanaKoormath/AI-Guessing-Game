const express = require("express");
const router = express.Router();
const { recordQuestion, markGameCorrect } =
  require("../logic/questionStats");
const { triggerMLRetrain } = require("../logic/retrainML");

const knowledgeBase = require("../data/knowledgeBase.json");
const { selectBestQuestion } = require("../logic/decisionEngine");
const { selectBestGuess } = require("../logic/confidenceEngine");
const { formatQuestion } = require("../logic/questionFormatter");
const DIET_ATTRIBUTES = [
  "isCarnivore",
  "isHerbivore",
  "isOmnivore"
];

const MAX_QUESTIONS = 15;
let gameState = null;
let completedGames = 0;
const RETRAIN_INTERVAL = 10; // retrain after every 10 games

// ---------- START ----------
router.post("/start", (req, res) => {
  gameState = {
    phase: "category",
     lockedCategory: null,
    remainingObjects: [...knowledgeBase.objects],
    askedAttributes: [],
      askedAttributesInGame: [], // 🧠 NEW

    currentAttribute: null,
    questionCount: 0,
    categoryStep: 0,
    lastConfidence: 0,
     categoryRetryCount: 0
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
// ================= CATEGORY PHASE =================
// ===== CATEGORY NOT-SURE GUARD =====
if (
  gameState.phase === "category" &&
  answer === null
) {
  gameState.categoryRetryCount++;

  // First time → clarify and re-ask
  if (gameState.categoryRetryCount === 1) {
    return res.json({
      status: "clarify",
      message:
        "Please try to answer this question. It helps me understand what kind of thing you are thinking of.\n" +
        "(If it's an animal or plant, answer Yes. If it's food or an object, answer No.)"
    });
  }

  // Second time → abort cleanly
  return res.json({
    status: "done",
    message:
      "I’m having trouble understanding the object. Please think of a clear, concrete thing and start again."
  });
}
// ================= CATEGORY PHASE =================
if (gameState.phase === "category") {
  gameState.questionCount++;

  const CATEGORY_ATTRIBUTES = [
    "isFood",
    "isElectronic",
    "isAppliance",
    "isVehicle"
  ];

  // Q1: Is it a living thing?
  if (gameState.categoryStep === 0) {
    if (answer === true) {
      // 🔒 LOCK Animal
      gameState.lockedCategory = "Animal";
      gameState.remainingObjects =
        gameState.remainingObjects.filter(o => o.category === "Animal");

      // 🚫 Block category attributes forever
      CATEGORY_ATTRIBUTES.forEach(attr => {
        if (!gameState.askedAttributes.includes(attr)) {
          gameState.askedAttributes.push(attr);
        }
      });

      gameState.categoryRetryCount = 0; // reset retry
      gameState.phase = "attributes";
    }
    else if (answer === false) {
      gameState.categoryStep = 1;
      return res.json({
        question: "Is it food?",
        questionNumber: gameState.questionCount + 1
      });
    }
  }

  // Q2: Is it food?
  else if (gameState.categoryStep === 1) {
    if (answer === true) {
      // 🔒 LOCK Food
      gameState.lockedCategory = "Food";
      gameState.remainingObjects =
        gameState.remainingObjects.filter(o => o.category === "Food");
    }
    else if (answer === false) {
      // 🔒 LOCK Object
      gameState.lockedCategory = "Object";
      gameState.remainingObjects =
        gameState.remainingObjects.filter(o => o.category === "Object");
    }

    // 🚫 Block category attributes forever
    CATEGORY_ATTRIBUTES.forEach(attr => {
      if (!gameState.askedAttributes.includes(attr)) {
        gameState.askedAttributes.push(attr);
      }
    });

    gameState.categoryRetryCount = 0; // reset retry
    gameState.phase = "attributes";
  }
}

  // ================= ATTRIBUTE PHASE =================
if (
  gameState.phase === "attributes" &&
  gameState.currentAttribute
) {
  const beforeCount = gameState.remainingObjects.length;

  // 🔍 Only filter when user is sure
  if (answer !== null) {
    gameState.remainingObjects =
      gameState.remainingObjects.filter(
        obj => obj.attributes[gameState.currentAttribute] === answer
      );
  }

  const afterCount = gameState.remainingObjects.length;

  // 🧠 ALWAYS log (including Not Sure)
  recordQuestion({
    attribute: gameState.currentAttribute,
    beforeCount,
    afterCount,
    answer
  });
}


// ===== DIET SHORT-CIRCUIT =====
if (
  gameState.phase === "attributes" &&
  answer !== null &&
  DIET_ATTRIBUTES.includes(gameState.currentAttribute)
) {
  // Mark all diet attributes as asked so they won't be asked again
  DIET_ATTRIBUTES.forEach(attr => {
    if (!gameState.askedAttributes.includes(attr)) {
      gameState.askedAttributes.push(attr);
    }
  });
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
// ===== ENFORCE CATEGORY LOCK =====
if (
  gameState.phase === "attributes" &&
  gameState.lockedCategory
) {
  gameState.remainingObjects =
    gameState.remainingObjects.filter(
      o => o.category === gameState.lockedCategory
    );
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
gameState.askedAttributesInGame.push(nextAttr);

    // Only mark as asked if user answered yes/no
   // Mark attribute as asked REGARDLESS of answer
if (!gameState.askedAttributes.includes(gameState.currentAttribute)) {
  gameState.askedAttributes.push(gameState.currentAttribute);
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
  markGameCorrect(gameState.askedAttributesInGame);

  completedGames++;

  if (completedGames % RETRAIN_INTERVAL === 0) {
    triggerMLRetrain();
  }

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
completedGames++;

if (completedGames % RETRAIN_INTERVAL === 0) {
  triggerMLRetrain();
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
