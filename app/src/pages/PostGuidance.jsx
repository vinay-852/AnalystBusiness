import React, { useState } from "react";
import { useUserChoices } from "../components/UserChoicesContext";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Header from "../components/Header";
import { Card, Button, Container, Spinner, Form } from "react-bootstrap";

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_MODEL = process.env.REACT_APP_GEMINI_MODEL || "gemini-1.5-flash";

const PostGuidance = () => {
  const { userChoices } = useUserChoices();
  const [postContent, setPostContent] = useState("");
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => window.location.reload();
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
    } else {
      setMediaPreview(null);
    }
  };

  const analyzeContent = async () => {
    if (!GEMINI_API_KEY) {
      setAnalysis(["Error: Gemini API key not configured."]);
      return;
    }
    setLoading(true);
    setAnalysis(null);
    let prompt = `Analyze the following social media post and provide improvement suggestions, engagement tips, and tone/style feedback.\n\n`;
    if (caption) prompt += `Caption: ${caption}\n`;
    if (postContent) prompt += `Content: ${postContent}\n`;
    if (userChoices && userChoices.length > 0) {
      prompt += `User Choices: ${userChoices.join(", ")}\n`;
    }
    if (media) {
      prompt += `Media type: ${media.type}, name: ${media.name}\n`;
    }
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
      const result = await model.generateContent(prompt);
      const responseText = result?.response?.text()?.trim();
      setAnalysis(
        responseText
          ? responseText.split("\n").filter((line) => line.trim() !== "")
          : ["No feedback generated."]
      );
    } catch (err) {
      setAnalysis([`Error generating analysis: ${err.message}`]);
    }
    setLoading(false);
  };

  return (
    <>
      <Header onLogout={handleLogout} />
      <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", background: "#f4f6fa" }}>
        <Card className="shadow-sm p-4" style={{ maxWidth: 600, width: "100%" }}>
          <Card.Body>
            <Card.Title className="mb-4" style={{ textAlign: "center", fontSize: "2rem", color: "#222" }}>Post Guidance</Card.Title>
            <Form.Group className="mb-3">
              <Form.Label>Upload Photo/Video</Form.Label>
              <Form.Control type="file" accept="image/*,video/*" onChange={handleMediaChange} />
            </Form.Group>
            {mediaPreview && (
              <div className="mb-3 text-center">
                {media && media.type.startsWith("image") ? (
                  <img src={mediaPreview} alt="preview" style={{ maxWidth: "100%", maxHeight: 250 }} />
                ) : (
                  <video src={mediaPreview} controls style={{ maxWidth: "100%", maxHeight: 250 }} />
                )}
              </div>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Caption</Form.Label>
              <Form.Control type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Enter caption..." />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control as="textarea" rows={4} value={postContent} onChange={(e) => setPostContent(e.target.value)} placeholder="Write your post content..." />
            </Form.Group>
            <Button variant="primary" onClick={analyzeContent} className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Analyze Post"}
            </Button>
            {analysis && (
              <Card className="mt-4">
                <Card.Body>
                  <Card.Title>Analysis & Suggestions</Card.Title>
                  <ul>
                    {analysis.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default PostGuidance;
