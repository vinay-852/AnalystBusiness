import React, { useEffect, useState, useRef } from "react";
import { useUserChoices } from "./UserChoicesContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const ArtisanAnalyst = ({ selectedPage }) => {
  const { userChoices } = useUserChoices() || { userChoices: [] };

  const [finalMarkdown, setFinalMarkdown] = useState("Loading...");
  const [error, setError] = useState(null);
  // Cache for storing last fbStats, userChoices, and response
  const cacheRef = useRef({
    fbStats: null,
    userChoices: null,
    response: null,
  });

  const fbStats = {
    fans: selectedPage?.fan_count ?? "N/A",
    followers: selectedPage?.followers_count ?? "N/A",
    location: selectedPage?.location?.city ?? "N/A",
    engagement: selectedPage?.engagement?.count ?? "N/A",
  };

  const choicesSummary =
    userChoices && userChoices.length > 0
      ? userChoices
          .map((c) => (typeof c === "string" ? c : JSON.stringify(c)))
          .join(", ")
      : "No choices made yet.";

  const runGemini = async (section, instructions) => {
  if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: process.env.REACT_APP_GEMINI_MODEL || "gemini-1.5-flash" });

    const prompt = `
You are an AI strategist. Generate insights for **${section}**.

📊 Facebook Data:  
- Fans: ${fbStats.fans}  
- Followers: ${fbStats.followers}  
- Location: ${fbStats.location}  
- Engagement: ${fbStats.engagement}  

🎨 Artist's Choices:  
${choicesSummary}  

⚡️ Section Instructions:  
${instructions}
`;

    const result = await model.generateContent(prompt);
    return result?.response?.text() || "";
  };




  useEffect(() => {
    if (!selectedPage) return;

    // Prepare cache keys
    const fbStatsKey = JSON.stringify(fbStats);
    const userChoicesKey = JSON.stringify(userChoices);

    // Check cache
    if (
      cacheRef.current.fbStats === fbStatsKey &&
      cacheRef.current.userChoices === userChoicesKey &&
      cacheRef.current.response
    ) {
      setFinalMarkdown(cacheRef.current.response);
      return;
    }

    const fetchAll = async () => {
      try {
        setFinalMarkdown("Loading insights...");
        setError(null);

        const [business, marketing, trends] = await Promise.all([
          runGemini(
            "Business Management",
            `- Provide 3–4 practical strategies.  
             - Cover pricing, customer retention, operations, and partnerships.  
             - Suggest beginner-friendly steps if stats are low.`
          ),
          runGemini(
            "Digital Marketing",
            `- Provide 3–4 actionable marketing tactics.  
             - Focus on content creation, ads, social media, analytics.  
             - Mention at least one current trend (short-form video, influencer collabs, AI tools).`
          ),
          runGemini(
            "Innovation & Trends",
            `- Provide 3–4 insights on innovation & future trends.  
             - Suggest useful tools (Canva, Shopify, Meta Ads Manager, AI).  `
          ),
        ]);

        const combined = `
## Business Management
${business}

## Digital Marketing
${marketing}

## Innovation & Trends
${trends}
        `;

        setFinalMarkdown(combined);
        // Store in cache
        cacheRef.current = {
          fbStats: fbStatsKey,
          userChoices: userChoicesKey,
          response: combined,
        };
      } catch (err) {
        console.error("Gemini error:", err);
        setError("Failed to fetch insights");
        setFinalMarkdown("⚠️ Failed to load.");
      }
    };

    fetchAll();
  }, [selectedPage, userChoices]);

  if (!selectedPage) return null;

  return (
    <div
      style={{
        background: "#f9f9f9",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        margin: "24px 0",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <h2 style={{ marginBottom: 12, color: "#333" }}>Artisan Analyst</h2>

      
      <p style={{ fontSize: 16, color: "#555", marginBottom: 8 }}>
        <strong>Fans:</strong> {fbStats.fans} &nbsp;
        <strong>Followers:</strong> {fbStats.followers} &nbsp;
        <strong>Location:</strong> {fbStats.location} &nbsp;
        <strong>Engagement:</strong> {fbStats.engagement}
      </p>

      <p style={{ fontSize: 15, color: "#666", marginBottom: 12 }}>
        <strong>Artist's Choices:</strong> {choicesSummary}
      </p>


  {error && <div style={{ color: "#b00020", marginBottom: 12 }}>{error}</div>}

      
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {finalMarkdown}
      </ReactMarkdown>

    </div>
  );
};

export default ArtisanAnalyst;