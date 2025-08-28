import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GeminiModal = ({ open, onClose, artistContext, onFinish }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0); // ✅ Track question count
  const chatEndRef = useRef(null);
  const chatSessionRef = useRef(null);

  // Gemini client
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Auto-scroll chat window
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start conversation when modal opens
  useEffect(() => {
    if (open && artistContext) {
      const introPrompt = `
You are an AI marketplace assistant for local artisans.
Your goal is to ask simple, friendly questions in a conversational style to learn about the artisan, their craft, and their products.
You will ask questions so you understand their preferences, needs, and challenges.

⚠️ Rules:

Ask only short, clear questions (max 12 words).

Ask one question at a time.

Do not explain or give examples.

Ask 8–10 questions total.

After ~10 questions, say exactly: "finished".

Context for this artisan:

Artist Page: ${artistContext.pageName}

Followers: ${artistContext.followers}

Likes: ${artistContext.likes}

Recent Posts: ${artistContext.recentPosts.join(" | ")}

Flow:

Start with a warm opening question about their products.

Continue with identity (who they are, location).

Explore craft details (materials, techniques, product types).

Ask about story/inspiration.

Cover business side (pricing, sales, customers).

Touch on digital presence (social media, online goals).

End with future goals/challenges.

Stop after ~10 questions with "finished".
`;

      // Initialize chat session
      chatSessionRef.current = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: introPrompt }],
          },
        ],
      });

      setMessages([{ sender: "bot", text: "⏳ Gemini is preparing..." }]);

      // Kick off first message
      chatSessionRef.current
        .sendMessage(introPrompt)
        .then((resp) => {
          handleBotReply(resp.response.text());
        })
        .catch((err) => {
          console.error(err);
          setMessages([{ sender: "bot", text: "⚠️ Failed to start Gemini." }]);
        });
    }
  }, [open, artistContext]);

  // ✅ Handle bot replies (count + detect finished)
  const handleBotReply = (botReply) => {
    const clean = botReply.trim();

    if (clean.toLowerCase().includes("finished")) {
      handleFinish(); // auto-finish when Gemini says "finished"
      return;
    }

    setMessages((prev) => [...prev, { sender: "bot", text: clean }]);

    if (clean.endsWith("?")) {
      setQuestionCount((prev) => prev + 1);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const resp = await chatSessionRef.current.sendMessage(
        `${input}\n\n(Remember: you have already asked ${questionCount} questions.)`
      );
      handleBotReply(resp.response.text());
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error talking to Gemini." },
      ]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => e.key === "Enter" && handleSend();

  // ✅ Structured JSON output
  const handleFinish = async () => {
    if (!chatSessionRef.current) return;
    setLoading(true);

    const convo = messages
      .map((m) => `${m.sender === "user" ? "User" : "Assistant"}: ${m.text}`)
      .join("\n");

    const summaryPrompt = `
Analyze the following conversation and produce a JSON object.

Rules:
- Use key-value pairs only.
- Keys should represent the main topics discussed.
- Values should be concise summaries of what was said.
- Include "total_questions" as a key with value ${questionCount}.
- Only output pure JSON (no markdown, no explanations, no extra text).

Conversation:
${convo}
`;

    try {
      const resp = await chatSessionRef.current.sendMessage(summaryPrompt);
      let jsonText = resp.response.text();

      // Clean possible markdown wrapping
      jsonText = jsonText.replace(/```json|```/g, "").trim();

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
        alignItems: "center",
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
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 10, right: 10 }}
        >
          ✕
        </button>
        <h2>AI Marketplace Assistant</h2>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                textAlign: msg.sender === "user" ? "right" : "left",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  background: msg.sender === "user" ? "#4267B2" : "#eee",
                  color: msg.sender === "user" ? "white" : "black",
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
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            style={{
              padding: "8px 14px",
              background: "#4267B2",
              color: "white",
              borderRadius: "6px",
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
            borderRadius: "6px",
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
