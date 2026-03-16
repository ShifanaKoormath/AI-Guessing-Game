const knowledgeBase = require("./data/knowledgeBase.json");
const { selectBestQuestion } = require("./logic/decisionEngine");
const { selectBestGuess } = require("./logic/confidenceEngine");

const MAX_QUESTIONS = 15;
const SIMULATIONS = 10000;

// Metrics
let totalQuestions = 0;
let correct = 0;

let totalReduction = 0;
let reductionSteps = 0;

// Confusion matrix
const confusion = {};

// Attribute importance
const attributeUsage = {};

// Hard objects
const objectFailures = {};

function simulateGame(targetObject) {

  let remainingObjects = [...knowledgeBase.objects];
  let askedAttributes = [];
  let questionCount = 0;

  while (questionCount < MAX_QUESTIONS) {

    if (remainingObjects.length <= 1) break;

    const nextAttr = selectBestQuestion(
      remainingObjects,
      askedAttributes
    );

    if (!nextAttr) break;

    askedAttributes.push(nextAttr);

    // Track attribute usage
    attributeUsage[nextAttr] =
      (attributeUsage[nextAttr] || 0) + 1;

    const before = remainingObjects.length;

    const answer = targetObject.attributes[nextAttr];

    remainingObjects = remainingObjects.filter(
      obj => obj.attributes[nextAttr] === answer
    );

    const after = remainingObjects.length;

    const reduction =
      before === 0 ? 0 : (before - after) / before;

    totalReduction += reduction;
    reductionSteps++;

    questionCount++;
  }

  const guess = selectBestGuess(remainingObjects);

  totalQuestions += questionCount;

  // Track confusion matrix
  if (!confusion[targetObject.name]) {
    confusion[targetObject.name] = {};
  }

  confusion[targetObject.name][guess.name] =
    (confusion[targetObject.name][guess.name] || 0) + 1;

  if (guess.name === targetObject.name) {
    correct++;
  } else {

    objectFailures[targetObject.name] =
      (objectFailures[targetObject.name] || 0) + 1;
  }
}


// Run simulations
for (let i = 0; i < SIMULATIONS; i++) {

  const obj =
    knowledgeBase.objects[
      Math.floor(Math.random() * knowledgeBase.objects.length)
    ];

  simulateGame(obj);
}


// =============================
// REPORT
// =============================

console.log("\n==============================");
console.log("AI Guessing System Evaluation");
console.log("==============================\n");

console.log("Total simulations:", SIMULATIONS);

console.log(
  "Accuracy:",
  (correct / SIMULATIONS).toFixed(3)
);

console.log(
  "Average Questions:",
  (totalQuestions / SIMULATIONS).toFixed(2)
);

console.log(
  "Avg Candidate Reduction:",
  (totalReduction / reductionSteps).toFixed(3)
);


// =============================
// TOP ATTRIBUTES
// =============================

console.log("\nMost Used Attributes");

const sortedAttrs = Object.entries(attributeUsage)
  .sort((a,b) => b[1] - a[1])
  .slice(0,10);

sortedAttrs.forEach(([attr,count])=>{
  console.log(attr, ":", count);
});


// =============================
// HARDEST OBJECTS
// =============================

console.log("\nHardest Objects To Guess");

const hardObjects = Object.entries(objectFailures)
  .sort((a,b)=>b[1]-a[1])
  .slice(0,10);

hardObjects.forEach(([obj,count])=>{
  console.log(obj, "failed", count, "times");
});


// =============================
// CONFUSION MATRIX
// =============================

console.log("\nConfusion Matrix (Top Errors)");

for (const actual in confusion) {

  const predictions = confusion[actual];

  const sorted = Object.entries(predictions)
    .sort((a,b)=>b[1]-a[1]);

  const top = sorted[0];

  if (!top) continue;

  if (top[0] !== actual) {
    console.log(
      actual,
      "→",
      top[0],
      "(" + top[1] + ")"
    );
  }
}