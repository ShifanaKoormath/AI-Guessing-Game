const { spawn } = require("child_process");
const path = require("path");

function triggerMLRetrain() {
  const scriptPath = path.join(
    __dirname,
    "..",
    "ml",
    "train_question_model.py"
  );

  spawn("python", [scriptPath], {
    cwd: path.join(__dirname, "..", "ml"),
    detached: true,
    stdio: "ignore"
  }).unref();

  console.log("🧠 ML retraining triggered (batch mode)");
}

module.exports = { triggerMLRetrain };
