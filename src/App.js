import React, { useState } from "react";
import ChatBot from "./components/ChatBot";
import SmartPlanner from "./components/SmartPlanner";

export default function App() {
  const [view, setView] = useState("chatbot");

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 20, padding: 20 }}>
        <button onClick={() => setView("chatbot")} style={{ padding: 10, borderRadius: 8, background: view === "chatbot" ? "#6366f1" : "#334155", color: "white", border: "none" }}>Do It ChatBot</button>
        <button onClick={() => setView("planner")} style={{ padding: 10, borderRadius: 8, background: view === "planner" ? "#6366f1" : "#334155", color: "white", border: "none" }}>Smart Planner</button>
      </div>
      {view === "chatbot" ? <ChatBot /> : <SmartPlanner />}
    </div>
  );
}
