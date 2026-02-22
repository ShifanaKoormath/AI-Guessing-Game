import React, { useState } from "react";
import "./App.css";

function App() {
  const [stage, setStage] = useState("intro"); 
  // intro | game | result | learning

  const [question, setQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);

  const [guess, setGuess] = useState("");
const [confidence, setConfidence] = useState(0);
  const [awaitingFeedback, setAwaitingFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [transitionMessage, setTransitionMessage] = useState("");

  const [guessVisible, setGuessVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [clarification, setClarification] = useState("");

  // ===== LEARNING =====
  const [learningStage, setLearningStage] = useState(null); 
  // "name" | "attributes"

  const [learnName, setLearnName] = useState("");
  const [learningQuestion, setLearningQuestion] = useState("");


  const [learningConsent, setLearningConsent] = useState(false);
  // ---------- START ----------
  const startGame = async () => {
    const res = await fetch("http://localhost:5000/game/start", {
      method: "POST"
    });
    const data = await res.json();

    setQuestion(data.question);
    setQuestionNumber(data.questionNumber);
    setClarification("");
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

    if (data.status === "clarify") {
      setClarification(data.message);
      setLoading(false);
      return;
    }

    if (data.status === "done" && !data.guess) {
      setFeedbackMessage(data.message);
      setStage("result");
      setAwaitingFeedback(false);
      setLoading(false);
      return;
    }

    if (data.status === "guess") {
      setClarification("");
      setGuessVisible(false);

      setTimeout(() => {
        setGuess(data.guess);
        setConfidence(data.confidence);
        setGuessVisible(true);
      }, 120);

      setAwaitingFeedback(true);
      setStage("result");
    } else {
      setClarification("");
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

    // ===== ENTER LEARNING CARD =====
if (data.status === "learn_prompt") {
  setGuess("");              // 🔴 CLEAR old guess display
  setConfidence(0);          // 🔴 reset confidence
  setFeedbackMessage(data.message);
  setLearningConsent(true);
  setAwaitingFeedback(false);
  return;
}

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

    setFeedbackMessage(data.message);
    };

  // ---------- SUBMIT OBJECT NAME ----------
  const submitLearnName = async () => {
    if (!learnName.trim()) return;

    await fetch("http://localhost:5000/game/learn/name", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: learnName })
    });

    const res = await fetch("http://localhost:5000/game/learn/start", {
      method: "POST"
    });

    const data = await res.json();

    if (data.status === "ASK_ATTRIBUTE") {
      setLearningStage("attributes");
      setLearningQuestion(data.question);
    }
  };

  // ---------- LEARNING ANSWER ----------
  const sendLearnAnswer = async (answer) => {
    const res = await fetch("http://localhost:5000/game/learn/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer })
    });

    const data = await res.json();

    if (data.status === "ASK_ATTRIBUTE") {
      setLearningQuestion(data.question);
    } 
    else if (data.status === "LEARNING_COMPLETE") {
      setStage("result");               // return to result card
      setFeedbackMessage(data.message);
      setLearningStage(null);
      setLearnName("");
    }
  };

  const resetGame = () => {
    setStage("intro");
    setGuess("");
    setConfidence(0);
    setFeedbackMessage("");
    setTransitionMessage("");
    setClarification("");
    setLearningStage(null);
    setLearnName("");
    setLearningConsent(false);
  };

  // ===================== UI =====================
  return (
    <div className="container">
      <div className="card">

        {/* INTRO */}
        {stage === "intro" && (
          <>
            <h1>🤖 AI Guessing Game</h1>
            <p>Think of something. I’ll try to guess it.</p>
            <button onClick={startGame}>Start</button>
          </>
        )}

        {/* GAME */}
        {stage === "game" && (
          <>
            <h2>Question {questionNumber} / 15</h2>
            <p className="question">{question}</p>

            {clarification && (
              <p className="clarification">{clarification}</p>
            )}

            <div className="buttons">
              <button onClick={() => sendAnswer(true)}>Yes 👍</button>
              <button onClick={() => sendAnswer(false)}>No 👎</button>
            </div>

            <button className="not-sure" onClick={() => sendAnswer(null)}>
              Not sure 🤷
            </button>

            <p className={`thinking ${loading ? "show" : ""}`}>
              🤔 Thinking…
            </p>
          </>
        )}

{/* RESULT */}
{stage === "result" && (
  <>
    {transitionMessage && (
      <div className="system-text">{transitionMessage}</div>
    )}

    {guess && (
      <>
        <div className="guess-label">🤖 My Guess</div>
        <div className={`final-guess ${guessVisible ? "show" : ""}`}>
          {guess}
        </div>
        <p className="confidence">
          Confidence: <b>{confidence}%</b>
        </p>
      </>
    )}

    {/* FEEDBACK BUTTONS */}
    {awaitingFeedback && (
      <>
        <p className="subtitle">Was I right?</p>
        <div className="buttons feedback">
          <button onClick={() => sendFeedback(true)}>Yes 👍</button>
          <button onClick={() => sendFeedback(false)}>No 👎</button>
        </div>
      </>
    )}

    {/* CONSENT UI */}
    {!awaitingFeedback && learningConsent && (
      <>
        <div className="system-text">{feedbackMessage}</div>
        <p className="subtitle">Would you like to teach me?</p>

        <div className="buttons feedback">
          <button
            onClick={() => {
              setLearningConsent(false);
              setStage("learning");
              setLearningStage("name");
            }}
          >
            Yes 👍
          </button>

          <button
            onClick={() => {
              setLearningConsent(false);
              setFeedbackMessage("No worries 🙂 Maybe next time!");
            }}
          >
            No 👎
          </button>
        </div>
      </>
    )}

    {/* NORMAL RESULT MESSAGE */}
    {!awaitingFeedback && feedbackMessage && !learningConsent && (
      <>
        <div className="system-text">{feedbackMessage}</div>
        <button className="play-again" onClick={resetGame}>
          Play Again 🔄
        </button>
      </>
    )}
  </>
)}

{/* LEARNING CARD */}
{stage === "learning" && (
  <div className="learning-wrapper">
    
    {/* HEADER */}
    <div className="learning-header">
      <span className="learning-icon">📘</span>
      <h2>Learning Mode</h2>
    </div>

    {/* NAME STEP */}
    {learningStage === "name" && (
      <div className="learning-section">
        <p className="learning-text">
          I couldn’t figure it out this time.
          <br />
          What was the object?
        </p>

        <div className="learning-input-group">
          <input
            className="learning-input"
            value={learnName}
            onChange={(e) => setLearnName(e.target.value)}
            placeholder="Type object name..."
          />

          <button
            className="primary-btn"
            onClick={submitLearnName}
          >
            Continue →
          </button>
        </div>
      </div>
    )}

    {/* ATTRIBUTE STEP */}
    {learningStage === "attributes" && (
      <div className="learning-section">
        <h3 className="learn-object-title">{learnName}</h3>

        <div className="question-box">
          {learningQuestion}
        </div>

        <div className="buttons">
          <button
            className="yes-btn"
            onClick={() => sendLearnAnswer(true)}
          >
            Yes 👍
          </button>

          <button
            className="no-btn"
            onClick={() => sendLearnAnswer(false)}
          >
            No 👎
          </button>
        </div>

        <button
          className="not-sure"
          onClick={() => sendLearnAnswer(null)}
        >
          Not sure 🤷
        </button>
      </div>
    )}
  </div>
)}
      </div>
    </div>
  );
}

export default App;