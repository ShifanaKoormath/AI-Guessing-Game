const fs = require("fs");
const path = require("path");

const statsPath = path.join(
  __dirname,
  "..",
  "data",
  "questionStats.json"
);

function getAttributeWeights() {
  if (!fs.existsSync(statsPath)) return {};

  const stats = JSON.parse(fs.readFileSync(statsPath, "utf-8"));
  const weights = {};

  for (const [attr, data] of Object.entries(stats)) {
    const {
      asked,
      answeredNotSure,
      totalReduction
    } = data;

    if (asked === 0) continue;

    const avgReduction = totalReduction / asked;
    const notSureRate = answeredNotSure / asked;

    // 🎯 Weight formula (simple, effective)
    let weight = avgReduction * (1 - notSureRate);

    // Prevent zeroing out
    weights[attr] = Math.max(weight, 0.1);
  }

  return weights;
}

module.exports = { getAttributeWeights };
