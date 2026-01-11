import React, { useState } from "react";
import "./App.css";

function App() {
  const [stage, setStage] = useState("intro");
  const [question, setQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);

  const [guess, setGuess] = useState("");
  const [confidence, setConfidence] = useState(0);

  const [awaitingFeedback, setAwaitingFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [transitionMessage, setTransitionMessage] = useState("");

  const [guessVisible, setGuessVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  // ---------- START ----------
  const startGame = async () => {
    const res = await fetch("http://localhost:5000/game/start", {
      method: "POST"
    });
    const data = await res.json();

    setQuestion(data.question);
    setQuestionNumber(data.questionNumber);
    setStage("game");
  };

  // ---------- ANSWER ----------
  const sendAnswer = async (answer) => {
    setLoading(true);

    const res = await fetch("http://localhost:5000/game/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer })
    });

    const data = await res.json();

    if (data.status === "guess") {
      setGuessVisible(false);

      setTimeout(() => {
        setGuess(data.guess);
        setConfidence(data.confidence);
        setGuessVisible(true);
      }, 120);

      setAwaitingFeedback(true);
      setStage("result");
    } else {
      setQuestion(data.question);
      setQuestionNumber(data.questionNumber);
    }

    setLoading(false);
  };

  // ---------- FEEDBACK ----------
  const sendFeedback = async (correct) => {
    const res = await fetch("http://localhost:5000/game/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correct })
    });

    const data = await res.json();

    if (data.status === "retry") {
      setTransitionMessage("Hmm… let me try one more time.");

      setGuessVisible(false);
      setTimeout(() => {
        setGuess(data.guess);
        setConfidence(data.confidence);
        setGuessVisible(true);
      }, 120);

      setAwaitingFeedback(true);
      setTimeout(() => setTransitionMessage(""), 1200);
      return;
    }

    // Finished
    setFeedbackMessage(data.message);
    setAwaitingFeedback(false);
  };

  const resetGame = () => {
    setStage("intro");
    setGuess("");
    setConfidence(0);
    setFeedbackMessage("");
    setTransitionMessage("");
  };

  // ---------- UI ----------
  return (
    <div className="container">
      <div className="card">
        {stage === "intro" && (
          <>
            <h1>🤖 AI Guessing Game</h1>
            <p>Think of something. I’ll try to guess it.</p>
            <button onClick={startGame}>Start</button>
          </>
        )}

        {stage === "game" && (
          <>
            <h2>Question {questionNumber} / 15</h2>
            <p className="question">{question}</p>

            <div className="buttons">
              <button onClick={() => sendAnswer(true)}>Yes 👍</button>
              <button onClick={() => sendAnswer(false)}>No 👎</button>
            </div>

            <button
              className="not-sure"
              onClick={() => sendAnswer(null)}
            >
              Not sure 🤷
            </button>

            <p className={`thinking ${loading ? "show" : ""}`}>
              🤔 Thinking…
            </p>
          </>
        )}

        {stage === "result" && (
          <>
            {transitionMessage && (
              <div className="system-text">{transitionMessage}</div>
            )}

            <div className="guess-label">🤖 My Guess</div>

            <div
              className={`final-guess ${
                guessVisible ? "show" : ""
              }`}
            >
              {guess}
            </div>

            <p className="confidence">
              Confidence: <b>{confidence}%</b>
            </p>

            {awaitingFeedback && (
              <>
                <p className="subtitle">Was I right?</p>
                <div className="buttons feedback">
                  <button onClick={() => sendFeedback(true)}>
                    Yes 👍
                  </button>
                  <button onClick={() => sendFeedback(false)}>
                    No 👎
                  </button>
                </div>
              </>
            )}

            {!awaitingFeedback && feedbackMessage && (
              <>
                <div className="system-text">
                  {feedbackMessage}
                </div>
                <button
                  className="play-again"
                  onClick={resetGame}
                >
                  Play Again 🔄
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
