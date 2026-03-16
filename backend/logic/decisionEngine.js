let ML_WEIGHTS = null;

const { spawnSync } = require("child_process");

// Load ML weights ONCE
function loadMLWeights() {

  if (ML_WEIGHTS) return ML_WEIGHTS;

  const result = spawnSync(
    "python",
    ["ml/predict_question_weights.py"],
    {
      input: JSON.stringify({}), // no input needed
      encoding: "utf8"
    }
  );

  if (result.error) {
    console.log("⚠ ML fallback");
    ML_WEIGHTS = {};
    return ML_WEIGHTS;
  }

  try {
    ML_WEIGHTS = JSON.parse(result.stdout);
    console.log("🧠 ML WEIGHTS LOADED:", ML_WEIGHTS);
  } catch {
    ML_WEIGHTS = {};
  }

  return ML_WEIGHTS;
}

function selectBestQuestion(objects, askedAttributes) {

  const mlWeights = loadMLWeights();

  if (!objects || objects.length <= 1) return null;

  const attributes = Object.keys(objects[0].attributes);

  let bestAttribute = null;
  let bestScore = Infinity;
  let fallbackAttribute = null;

  for (const attr of attributes) {

    if (askedAttributes.includes(attr)) continue;

    let trueCount = 0;
    let falseCount = 0;

    for (const obj of objects) {
      const value = obj.attributes[attr];

      if (value === true) trueCount++;
      else if (value === false) falseCount++;
    }

    // attribute must split candidates
    if (trueCount > 0 && falseCount > 0) {

      if (!fallbackAttribute) fallbackAttribute = attr;

      const baseScore = Math.abs(trueCount - falseCount);

      const weight = mlWeights[attr] || 1;

      const score = baseScore / weight;

      if (score < bestScore) {
        bestScore = score;
        bestAttribute = attr;
      }
    }
  }

  return bestAttribute || fallbackAttribute;
}

module.exports = { selectBestQuestion };