import React, { useState } from "react";
import { useUserChoices } from "./UserChoicesContext";
import { useSelectedPage } from "./SelectedPageContext";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_MODEL = process.env.REACT_APP_GEMINI_MODEL || "gemini-1.5-flash";

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! Ask me anything about your business insights." },
  ]);
  const [input, setInput] = useState("");
  const { userChoices } = useUserChoices();
  const { selectedPage } = useSelectedPage();

  const generateGeminiAnswer = async (question) => {
    if (!selectedPage) return "Please select a page to get insights.";
    if (!GEMINI_API_KEY) return "Gemini API key is not configured.";

    const fbStats = {
      fans: selectedPage?.fan_count ?? "N/A",
      followers: selectedPage?.followers_count ?? "N/A",
      location: selectedPage?.location?.city ?? "N/A",
      engagement: selectedPage?.engagement?.count ?? "N/A",
    };

    const choicesSummary =
      userChoices && userChoices.length > 0
        ? userChoices
            .map((c) =>
              typeof c === "string" ? c : JSON.stringify(c, null, 2)
            )
            .join(", ")
        : "No choices made yet.";

    const prompt = `
You are an AI business analyst chatbot.
Answer clearly and concisely using the context below.

User Question: ${question}

Facebook Data:
- Fans: ${fbStats.fans}
- Followers: ${fbStats.followers}
- Location: ${fbStats.location}
- Engagement: ${fbStats.engagement}

User Choices: ${choicesSummary}
    `;

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
      const result = await model.generateContent(prompt);
      return result?.response?.text().trim() || "No answer generated.";
    } catch (err) {
      return "Error generating answer: " + err.message;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage, { sender: "bot", text: "..." }]);
    setInput("");

    const answer = await generateGeminiAnswer(input);
    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = { sender: "bot", text: answer };
      return updated;
    });
  };

  return (
    <div
      style={{
        position: "relative",
        width: 350,
        height: 420,
        display: "flex",
        flexDirection: "column",
        background: "#fdfdfd",
        borderRadius: 16,
        border: "1px solid #ccc",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        overflow: "hidden",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <button
        onClick={onClose}
        title="Close Chat"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: "#eee",
          border: "none",
          borderRadius: "50%",
          width: 28,
          height: 28,
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        ×
      </button>

      <div
        style={{
          flex: 1,
          padding: 10,
          overflowY: "auto",
          background: "#fafafa",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent:
                msg.sender === "user" ? "flex-end" : "flex-start",
              margin: "6px 0",
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 18,
                maxWidth: "75%",
                fontSize: 14,
                lineHeight: 1.4,
                background:
                  msg.sender === "user" ? "#0078ff" : "#e4e6eb",
                color: msg.sender === "user" ? "white" : "#222",
                borderBottomRightRadius:
                  msg.sender === "user" ? 4 : 18,
                borderBottomLeftRadius:
                  msg.sender === "bot" ? 4 : 18,
              }}
            >
              <b>{msg.sender === "bot" ? "Bot" : "You"}:</b> {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          padding: 10,
          borderTop: "1px solid #ddd",
          background: "white",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: 18,
            border: "1px solid #ccc",
            outline: "none",
            fontSize: 14,
          }}
        />
        <button
          onClick={handleSend}
          style={{
            marginLeft: 8,
            padding: "8px 14px",
            borderRadius: 18,
            border: "none",
            background: "#0078ff",
            color: "white",
            fontSize: 14,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#005fcc")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#0078ff")}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
