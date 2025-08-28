import React from "react";

const MainContent = ({ selectedPage, chatOpen, onOpenChat }) => (
  <main
    style={{
      flex: chatOpen ? "1 1 calc(100% - 400px)" : "1",
      padding: "20px",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      transition: "flex 0.3s ease-in-out",
    }}
  >
    {selectedPage ? (
      <div
        style={{
          flex: 1,
          background: "#f5f5f5",
          borderRadius: "12px",
          boxShadow: "inset 0 2px 6px rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "22px",
          fontWeight: "bold",
        }}
      >
        For Displaying Strategy
      </div>
    ) : (
      <p>Please select a page on the Dashboard.</p>
    )}
    {/* Floating Chat Button */}
    {!chatOpen && (
      <button
        onClick={onOpenChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "#4267B2",
          color: "white",
          border: "none",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          cursor: "pointer",
          fontSize: "18px",
        }}
        title="Chat"
      >
        💬
      </button>
    )}
  </main>
);

export default MainContent;
