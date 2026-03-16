const knowledgeBase = require("./data/knowledgeBase.json");
const { selectBestQuestion } = require("./logic/decisionEngine");
const { selectBestGuess } = require("./logic/confidenceEngine");
const { logGame } = require("./utils/gameLogger");

const SIMULATIONS = 10000;

function runSimulation() {

  const objects = knowledgeBase.objects;

  const targetObject =
    objects[Math.floor(Math.random() * objects.length)];

  let remainingObjects = [...objects];
  let askedAttributes = [];
  let attributeAnswers = {};

  let questionCount = 0;

  while (true) {

    const attr = selectBestQuestion(
      remainingObjects,
      askedAttributes
    );

    if (!attr) break;

    askedAttributes.push(attr);

    const answer = targetObject.attributes[attr];

    attributeAnswers[attr] = answer;

    remainingObjects =
      remainingObjects.filter(
        o => o.attributes[attr] === answer
      );

    questionCount++;

    if (
      remainingObjects.length <= 1 ||
      questionCount >= 15
    ) break;
  }

  const guess =
    selectBestGuess(remainingObjects);

  const guessedName =
    guess ? guess.name : "none";

  const correct =
    guessedName === targetObject.name;

  logGame({
    actual_object: targetObject.name,
    guessed_object: guessedName,
    questions_asked: questionCount,
    objects_remaining: remainingObjects.length,
    correct_guess: correct,
    attributes_used: askedAttributes,
    ml_used: true
  });

  return correct;
}

function runSimulations() {

  let correct = 0;

  console.log(`Running ${SIMULATIONS} simulations...\n`);

  for (let i = 0; i < SIMULATIONS; i++) {

    if (runSimulation()) correct++;

  }

  const accuracy = correct / SIMULATIONS;

  console.log("================================");
  console.log("Simulation Complete");
  console.log("================================");
  console.log("Total Games:", SIMULATIONS);
  console.log("Correct:", correct);
  console.log("Accuracy:", accuracy.toFixed(3));
}

runSimulations();