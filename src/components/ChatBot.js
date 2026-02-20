import React, { useState } from "react";

const steps = [
  {
    type: "options",
    question: "🎓 What is your current education level?",
    options: ["Undergraduate", "Postgraduate", "Higher Secondary", "Other"],
  },
  {
    type: "options",
    question: "🏫 Which board or university are you in?",
    options: ["CBSE", "ICSE", "State Board", "IB", "University", "Other"],
  },
  {
    type: "options",
    question: "💻 What is your main subject or stream?",
    options: ["Science", "Commerce", "Engineering / CS", "Arts", "Medical"],
  },
  {
    type: "input",
    question: "🎯 What exactly do you want to achieve?",
  },
  {
    type: "input",
    question: "📍 What is your current position?",
  },
  {
    type: "input",
    question: "🛠 What resources do you have?",
  },
  {
    type: "input",
    question: "🚧 What are your constraints?",
  },
  {
    type: "input",
    question: "🔥 What friction stops you?",
  },
];

export default function ChatBot() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [messages, setMessages] = useState([
    { text: steps[0].question, type: "bot" },
  ]);

  function addMessage(text, type = "bot") {
    setMessages((msgs) => [...msgs, { text, type }]);
  }

  function handleOption(opt) {
    setAnswers((a) => ({ ...a, [steps[currentStep].question]: opt }));
    addMessage(opt, "user");
    nextStep();
  }

  function handleInput(val) {
    if (!val.trim()) return;
    setAnswers((a) => ({ ...a, [steps[currentStep].question]: val }));
    addMessage(val, "user");
    nextStep();
  }

  function nextStep() {
    const next = currentStep + 1;
    setCurrentStep(next);
    if (next < steps.length) {
      addMessage(steps[next].question);
    }
  }

  function showSummary() {
    return (
      <div style={{ marginTop: 20 }}>
        <div className="message">✨ Here's what I understand:</div>
        {Object.entries(answers).map(([key, val]) => (
          <div className="message" key={key}>
            <b>{key}</b>
            <div>{val}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 500, margin: "auto", padding: 20 }}>
      <div className="title" style={{ textAlign: "center", fontSize: 40, fontWeight: "bold", color: "#60a5fa" }}>
        Do it
      </div>
      <div className="subtitle" style={{ textAlign: "center", opacity: 0.7, marginBottom: 20 }}>
        We don’t generate faster. We generate better — because we understand first.
      </div>
      <div className="progress-box" style={{ background: "#1e293b", padding: 15, borderRadius: 15, marginBottom: 20 }}>
        <div>🧠 Understanding you...</div>
        <div className="progress-bar" style={{ height: 8, background: "#334155", borderRadius: 10, overflow: "hidden", marginTop: 10 }}>
          <div
            className="progress-fill"
            style={{ height: "100%", width: `${(currentStep / steps.length) * 100}%`, background: "linear-gradient(to right,#22d3ee,#6366f1)", transition: "0.4s" }}
          ></div>
        </div>
        <div className="step-tags" style={{ marginTop: 10 }}>
          {[
            "Identity",
            "Context",
            "Goal",
            "Position",
            "Resources",
            "Constraints",
            "Friction",
          ].map((tag) => (
            <span key={tag} style={{ background: "#334155", padding: "5px 10px", borderRadius: 20, margin: 3, fontSize: 12, display: "inline-block" }}>{tag}</span>
          ))}
        </div>
      </div>
      <div className="chat" style={{ marginTop: 10 }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={"message " + (msg.type === "user" ? "user" : "")}
            style={{
              background: msg.type === "user" ? "linear-gradient(135deg,#6366f1,#22d3ee)" : "#1e293b",
              textAlign: msg.type === "user" ? "right" : "left",
              padding: 15,
              borderRadius: 15,
              marginBottom: 10,
              color: "white",
            }}
          >
            {msg.text}
          </div>
        ))}
        {currentStep < steps.length && steps[currentStep].type === "options" && (
          <div className="options">
            {steps[currentStep].options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleOption(opt)}
                style={{ width: "100%", margin: "6px 0", padding: 12, border: "none", borderRadius: 12, background: "#334155", color: "white", cursor: "pointer", transition: "0.3s" }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
        {currentStep < steps.length && steps[currentStep].type === "input" && (
          <div className="input-box" style={{ display: "flex", marginTop: 10 }}>
            <input
              type="text"
              placeholder="Type here..."
              style={{ flex: 1, padding: 12, border: "none", borderRadius: 12, background: "#1e293b", color: "white" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleInput(e.target.value);
              }}
            />
            <button
              style={{ marginLeft: 5, padding: 12, border: "none", borderRadius: 12, background: "#6366f1", color: "white", cursor: "pointer" }}
              onClick={(e) => {
                const input = e.target.previousSibling;
                handleInput(input.value);
              }}
            >
              ➤
            </button>
          </div>
        )}
        {currentStep >= steps.length && showSummary()}
      </div>
    </div>
  );
}
