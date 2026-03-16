const fs = require("fs");
const path = require("path");

const LOG_PATH = path.join(__dirname, "../logs/gameLogs.json");

function logGame(gameData) {
  try {
    let logs = [];

    if (fs.existsSync(LOG_PATH)) {
      logs = JSON.parse(fs.readFileSync(LOG_PATH, "utf8"));
    }

    if (!Array.isArray(logs)) {
      logs = [];
    }

    logs.push({
      game_id: logs.length + 1,
      timestamp: Date.now(),
      ...gameData
    });

    fs.writeFileSync(LOG_PATH, JSON.stringify(logs, null, 2));

  } catch (err) {
    console.error("Game logging failed:", err);
  }
}

module.exports = { logGame };