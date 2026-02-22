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

// ======================================================
// MUTUALLY EXCLUSIVE ATTRIBUTE GROUPS
// Only ONE in a group can be true at a time
// ======================================================

const MUTUAL_GROUPS = [

  // ---------- ANIMAL TYPE ----------
  ["isMammal", "isBird", "isReptile", "isFish", "isInsect"],

  // ---------- HABITAT PRIMARY ----------
  ["livesOnLand", "livesInWater", "livesInAir"],

  // ---------- DIET ----------
  ["isCarnivore", "isHerbivore", "isOmnivore"],

  // ---------- SIZE ----------
  ["isTiny", "isMedium", "isLarge"],

  // ---------- FOOD BASE ----------
  ["isPlantBased", "isAnimalBased"],

  // ---------- FOOD TYPE ----------
  ["isFruit", "isGrainDish", "isBreadType"],

  // ---------- FOOD STATE ----------
  ["isLiquid", "isSolidSnack"],

  // ---------- TASTE ----------
  ["isSweet", "isSalty"],

  // ---------- SERVING TEMP ----------
  ["servedHot", "servedCold"],

  // ---------- POWER SOURCE ----------
  ["usesElectricity", "usesFuel", "usesHumanPower"],

  // ---------- OBJECT CLASS ----------
  ["isElectronic", "isAppliance", "isFurniture", "isVehicle"],

  // ---------- MOBILITY ----------
  ["fullyPortable", "semiPortable", "fixedInPlace"],

  // ---------- USAGE PRIMARY ----------
  ["usedForCommunication", "usedForWork", "usedForEntertainment", "usedForTransport", "usedForCooking"],

  // ---------- FUNCTION ----------
  ["isForCooling", "isForHeating"]

];


// ======================================================
// ATTRIBUTE IMPLICATION RULES
// If key is TRUE → enforce implied values
// ======================================================

const IMPLICATION_RULES = {

  // ---------- FOOD ----------
  isFruit: {
    isPlantBased: true,
    isAnimalBased: false,
    isLiquid: false,
    isDairy: false
  },

  isPlantBased: {
    isAnimalBased: false
  },

  isAnimalBased: {
    isPlantBased: false
  },

  isLiquid: {
    isSolidSnack: false
  },

  // ---------- ANIMAL ----------
  isMammal: {
    isBird: false,
    isReptile: false,
    isFish: false,
    isInsect: false
  },

  isBird: {
    isMammal: false,
    isReptile: false,
    isFish: false,
    isInsect: false
  },

  isReptile: {
    isMammal: false,
    isBird: false,
    isFish: false,
    isInsect: false
  },

  isFish: {
    isMammal: false,
    isBird: false,
    isReptile: false,
    isInsect: false
  },

  // ---------- OBJECT ----------
  usesElectricity: {
    usesFuel: false,
    usesHumanPower: false
  },

  usesFuel: {
    usesElectricity: false,
    usesHumanPower: false
  },

  usesHumanPower: {
    usesElectricity: false,
    usesFuel: false
  }
};

const MAX_QUESTIONS = 15;
let gameState = null;
let learningState = null;
/*
learningState structure:

{
  lockedCategory: "Animal",
  objectName: "",
  attributes: {},           // collected answers
  remainingAttributes: [],  // attributes yet to ask
  currentAttribute: null
}
*/

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
    attributeAnswers: {},   // 🔴 NEW
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

  // 🔴 STORE ANSWER
  gameState.attributeAnswers[gameState.currentAttribute] = answer;

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

// If no more objects → ENTER LEARNING MODE
if (gameState.remainingObjects.length === 0) {

// ============================================
// BUILD SNAPSHOT OF GAMEPLAY ANSWERS FOR LEARNING
// ============================================
const prefilledAttributes = {};

for (const [attr, val] of Object.entries(gameState.attributeAnswers)) {
  if (val !== null && val !== undefined) {
    prefilledAttributes[attr] = val;
  }
}

// ============================================
// CREATE LEARNING STATE WITH PREFILLED ANSWERS
// ============================================
learningState = {
  lockedCategory: gameState.lockedCategory,
  objectName: "",
  attributes: { ...prefilledAttributes },   // <-- PRESERVE GAME KNOWLEDGE

  
  remainingAttributes: [],
  currentAttribute: null
};
// ======================================
// APPLY IMPLICATION RULES (INITIAL PREFILL)
// ======================================
for (const [attr, val] of Object.entries(learningState.attributes)) {
  if (val === true && IMPLICATION_RULES[attr]) {
    Object.assign(
      learningState.attributes,
      IMPLICATION_RULES[attr]
    );
  }
}
// NOW it is safe to clear gameState
gameState = null;

  return res.json({
    status: "learn_prompt",
    message: "I couldn't guess it. Can you teach me what it was?"
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

// ======================================================
// LEARNING MODE — DIFFERENTIAL / GUIDED ATTRIBUTE LEARNING
// ======================================================

const fs = require("fs");
const path = require("path");
const KB_PATH = path.join(__dirname, "../data/knowledgeBase.json");


// ---------- LEARN NAME (User provides object name) ----------
router.post("/learn/name", (req, res) => {
  if (!learningState) {
    return res.status(400).json({ error: "NO_LEARNING_SESSION" });
  }

  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: "INVALID_NAME" });
  }

  learningState.objectName = name.trim();

  return res.json({
    status: "NAME_ACCEPTED"
  });
});


// ---------- LEARN START (Prepare attribute questioning) ----------
router.post("/learn/start", (req, res) => {
  if (!learningState || !learningState.objectName) {
    return res.status(400).json({
      error: "LEARNING_NOT_READY"
    });
  }

  try {
    const kb = JSON.parse(fs.readFileSync(KB_PATH, "utf8"));

    // Build category schema (all attributes)
    const categoryObjects = kb.objects.filter(
      o => o.category === learningState.lockedCategory
    );

    const allowedAttributes = new Set();
    for (const obj of categoryObjects) {
      Object.keys(obj.attributes).forEach(attr =>
        allowedAttributes.add(attr)
      );
    }



// ======================================
// APPLY MUTUAL EXCLUSION RULES
// ======================================
for (const group of MUTUAL_GROUPS) {
  const trueAttr = group.find(a => learningState.attributes[a] === true);

  if (trueAttr) {
    for (const attr of group) {
      if (attr !== trueAttr) {
        learningState.attributes[attr] = false;
      }
    }
  }
}

// ======================================
// BUILD REMAINING ATTRIBUTE LIST (UNKNOWN ONLY)
// ======================================
learningState.remainingAttributes = Array.from(allowedAttributes)
  .filter(attr => !(attr in learningState.attributes));
    if (learningState.remainingAttributes.length === 0) {
      return res.status(500).json({
        error: "NO_SCHEMA_ATTRIBUTES"
      });
    }

    // Ask first attribute
    const firstAttr = learningState.remainingAttributes.shift();
    learningState.currentAttribute = firstAttr;

    return res.json({
      status: "ASK_ATTRIBUTE",
      question: formatQuestion(firstAttr)
    });

  } catch (err) {
    return res.status(500).json({
      error: "LEARNING_INIT_FAILED"
    });
  }
});


// ---------- LEARN ANSWER (Loop attribute collection) ----------
router.post("/learn/answer", (req, res) => {
  if (!learningState || !learningState.currentAttribute) {
    return res.status(400).json({
      error: "NO_ACTIVE_ATTRIBUTE"
    });
  }

  const { answer } = req.body;

  // Store answer
  learningState.attributes[learningState.currentAttribute] = answer;

// ======================================
// APPLY IMPLICATION RULES (LIVE)
// ======================================
if (
  answer === true &&
  IMPLICATION_RULES[learningState.currentAttribute]
) {
  Object.assign(
    learningState.attributes,
    IMPLICATION_RULES[learningState.currentAttribute]
  );
}

  // Apply mutual exclusion immediately after answer
for (const group of MUTUAL_GROUPS) {
  if (group.includes(learningState.currentAttribute) && answer === true) {
    for (const attr of group) {
      if (attr !== learningState.currentAttribute) {
        learningState.attributes[attr] = false;
      }
    }
  }
}
  // Ask next attribute if remaining
  if (learningState.remainingAttributes.length > 0) {
    const nextAttr = learningState.remainingAttributes.shift();
    learningState.currentAttribute = nextAttr;

    return res.json({
      status: "ASK_ATTRIBUTE",
      question: formatQuestion(nextAttr)
    });
  }

  // ==============================
  // FINALIZE LEARNING (WRITE TO KB)
  // ==============================
  try {
    const kb = JSON.parse(fs.readFileSync(KB_PATH, "utf8"));

    // Duplicate name check
    const duplicate = kb.objects.some(
      o => o.name.toLowerCase() === learningState.objectName.toLowerCase()
    );

    if (duplicate) {
      learningState = null;
      return res.status(409).json({
        error: "DUPLICATE_OBJECT"
      });
    }

    const newObject = {
      name: learningState.objectName,
      category: learningState.lockedCategory,
      attributes: learningState.attributes
    };

    kb.objects.push(newObject);

    // Safe atomic write
    const tmp = KB_PATH + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(kb, null, 2));
    fs.renameSync(tmp, KB_PATH);

    learningState = null;

    return res.json({
      status: "LEARNING_COMPLETE",
      message: "Got it 👍 I’ve learned something new!"
    });

  } catch (err) {
    return res.status(500).json({
      error: "LEARNING_SAVE_FAILED"
    });
  }
});
module.exports = router;
