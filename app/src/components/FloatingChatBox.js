import React from "react";

const FloatingChatBox = ({ onClose }) => (
  <div
    style={{
      marginTop: "20px",
      marginBottom: "20px",
      width: "400px",
      height: "95%",
      background: "black",
      color: "white",
      boxShadow: "-4px 0 8px rgba(0,0,0,0.4)",
      padding: "12px",
      position: "relative",
      transition: "all 0.3s ease-in-out",
    }}
  >
    <button
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "red",
        border: "none",
        borderRadius: "6px",
        padding: "6px 10px",
        color: "white",
        cursor: "pointer",
      }}
      onClick={onClose}
    >
      ✕
    </button>
    <div style={{ marginTop: "50px" }}>
      Floating Chat Content
    </div>
  </div>
);

export default FloatingChatBox;
