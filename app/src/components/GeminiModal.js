import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GeminiModal = ({ open, onClose, artistContext, onFinish }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const chatEndRef = useRef(null);
  const chatSessionRef = useRef(null);

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start session when modal opens
  useEffect(() => {
    if (open && artistContext) {
      const introPrompt = `
You are an AI marketplace assistant for local artisans.
Your job is to ask short, friendly questions (≤12 words).
Ask **one question at a time**. Adapt your next question to the artisan’s answer.
Ask between 5 and 10 valuable questions total, then say exactly: "finished".

Context:
Artist Page: ${artistContext.pageName}
Followers: ${artistContext.followers}
Likes: ${artistContext.likes}
Recent Posts: ${artistContext.recentPosts.join(" | ")}

Flow:
1. Start with a warm opening about their products.
2. Identity (who they are, location).
3. Craft details (materials, techniques, products).
4. Story/inspiration.
5. Business side (pricing, sales, customers).
6. Digital presence (social media, online goals).
7. Future goals/challenges.

Stop after you have asked 5–10 valuable questions with "finished".
`;

      chatSessionRef.current = model.startChat({
        history: [
          { role: "user", parts: [{ text: introPrompt }] }
        ]
      });

      // Kick off first question
      chatSessionRef.current
        .sendMessage("Please ask your first question.")
        .then((resp) => handleBotReply(resp.response.text()))
        .catch((err) => {
          console.error(err);
          setMessages([{ sender: "bot", text: "⚠️ Failed to start Gemini." }]);
        });

      setMessages([{ sender: "bot", text: "⏳ Gemini is preparing..." }]);
    }
  }, [open, artistContext]);

  const handleBotReply = (reply) => {
    let clean = reply.trim();

    if (clean.toLowerCase().includes("finished")) {
      setMessages((prev) => [...prev, { sender: "bot", text: "finished" }]);
      // auto-finish and generate JSON summary
      handleFinish();
      return;
    }

    setMessages((prev) => [...prev, { sender: "bot", text: clean }]);
    setQuestionCount((prev) => prev + 1);
  };

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const resp = await chatSessionRef.current.sendMessage(
        `${input}\n(Remember: you already asked ${questionCount} questions. Stop after 5–10 valuable questions with 'finished'.)`
      );
      handleBotReply(resp.response.text());
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error talking to Gemini." }
      ]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => e.key === "Enter" && handleSend();

  const handleFinish = async () => {
    if (!chatSessionRef.current) return;
    setLoading(true);

    const convo = messages
      .map((m) => `${m.sender === "user" ? "User" : "Assistant"}: ${m.text}`)
      .join("\n");

    const summaryPrompt = `
Analyze this conversation and output JSON.
Rules:
- Key-value pairs only.
- Keys = topics, values = short summaries.
- Include "total_questions": ${questionCount}.
- Only output valid JSON.

Conversation:
${convo}
`;

    try {
      const resp = await chatSessionRef.current.sendMessage(summaryPrompt);
      let jsonText = resp.response.text().replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(jsonText);
      onFinish(parsed);
      onClose();
    } catch (err) {
      console.error("Error generating JSON:", err);
      alert("Failed to get structured summary from Gemini.");
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          width: "600px",
          maxHeight: "80vh",
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflowY: "auto"
        }}
      >
        <button onClick={onClose} style={{ position: "absolute", top: 10, right: 10 }}>✕</button>
        <h2>AI Marketplace Assistant</h2>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "10px"
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                textAlign: msg.sender === "user" ? "right" : "left",
                marginBottom: "8px"
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  background: msg.sender === "user" ? "#4267B2" : "#eee",
                  color: msg.sender === "user" ? "white" : "black"
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
          {loading && <div>⏳ Gemini is thinking...</div>}
          <div ref={chatEndRef} />
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer..."
            disabled={messages.some((m) => m.text.toLowerCase() === "finished")}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || messages.some((m) => m.text.toLowerCase() === "finished")}
            style={{
              padding: "8px 14px",
              background: "#4267B2",
              color: "white",
              borderRadius: "6px"
            }}
          >
            Send
          </button>
        </div>

        <button
          onClick={handleFinish}
          disabled={loading}
          style={{
            marginTop: "12px",
            padding: "8px 14px",
            background: "green",
            color: "white",
            borderRadius: "6px"
          }}
        >
          Finish & Save
        </button>

        <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
          ✅ Questions asked so far: <b>{questionCount}</b>
        </p>
      </div>
    </div>
  );
};

export default GeminiModal;
