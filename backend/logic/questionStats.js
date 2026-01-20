const fs = require("fs");
const path = require("path");

const statsPath = path.join(
  __dirname,
  "..",
  "data",
  "questionStats.json"
);

function loadStats() {
  if (!fs.existsSync(statsPath)) return {};
  return JSON.parse(fs.readFileSync(statsPath, "utf-8"));
}

function saveStats(stats) {
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
}

function recordQuestion({
  attribute,
  beforeCount,
  afterCount,
  answer,
  finalCorrect = false
}) {
  const stats = loadStats();

  if (!stats[attribute]) {
    stats[attribute] = {
      asked: 0,
      answeredYes: 0,
      answeredNo: 0,
      answeredNotSure: 0,
      totalReduction: 0,
      gamesLedToCorrectGuess: 0
    };
  }

  const entry = stats[attribute];

  entry.asked++;

  if (answer === true) entry.answeredYes++;
  else if (answer === false) entry.answeredNo++;
  else entry.answeredNotSure++;

  entry.totalReduction += Math.max(0, beforeCount - afterCount);

  if (finalCorrect) entry.gamesLedToCorrectGuess++;

  saveStats(stats);
}
function markGameCorrect(attributes) {
  const stats = loadStats();

  for (const attr of attributes) {
    if (stats[attr]) {
      stats[attr].gamesLedToCorrectGuess++;
    }
  }

  saveStats(stats);
}
module.exports = { recordQuestion, markGameCorrect };


