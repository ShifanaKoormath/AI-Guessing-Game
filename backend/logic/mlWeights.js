const { spawnSync } = require("child_process");
const path = require("path");

function getMLWeights() {
  const scriptPath = path.join(
    __dirname,
    "..",
    "ml",
    "predict_question_weights.py"
  );

  const pythonPath = "python"; // Windows-safe default

  try {
    const result = spawnSync(
      pythonPath,
      [scriptPath],
      {
        encoding: "utf-8",
        cwd: path.join(__dirname, "..", "ml") // 🔒 IMPORTANT
      }
    );

    if (result.error) {
      console.error("❌ Python spawn error:", result.error);
      return {};
    }

    if (result.stderr && result.stderr.trim()) {
      console.error("❌ Python stderr:", result.stderr);
      return {};
    }

    if (!result.stdout) {
      console.error("❌ No output from ML script");
      return {};
    }

    return JSON.parse(result.stdout);

  } catch (e) {
    console.error("❌ ML integration failure:", e);
    return {};
  }
}

module.exports = { getMLWeights };
