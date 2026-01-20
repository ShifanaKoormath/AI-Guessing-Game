const { getMLWeights } = require("./mlWeights");

function selectBestQuestion(objects, askedAttributes) {
const mlWeights = getMLWeights();
console.log("🧠 ML WEIGHTS IN USE:", mlWeights);

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

    // Must actually split
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
