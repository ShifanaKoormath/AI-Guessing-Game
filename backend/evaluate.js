const fs = require("fs");

const logs = JSON.parse(
  fs.readFileSync("./logs/gameLogs.json", "utf8")
);

const totalGames = logs.length;

const correctGames =
  logs.filter(g => g.correct_guess).length;

const avgQuestions =
  logs.reduce((s,g)=>s+g.questions_asked,0) / totalGames;

const avgReduction =
  logs.reduce((s,g)=>s+(g.avg_reduction||0),0) / totalGames;

console.log("Total Games:", totalGames);
console.log("Accuracy:", (correctGames/totalGames).toFixed(2));
console.log("Average Questions:", avgQuestions.toFixed(2));
console.log("Avg Candidate Reduction:", avgReduction.toFixed(2));