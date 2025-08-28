import React from "react";
import { useUserChoices } from "./UserChoicesContext";

const Sidebar = ({ selectedPage, onAddChoice }) => {
  const { userChoices } = useUserChoices();
  return (
  <aside
    style={{
      minWidth: "240px",
      maxWidth: "300px",
      background: "#f9f9f9",
      padding: "16px",
      borderRight: "1px solid #ddd",
      overflowY: "auto",
    }}
  >
    {selectedPage ? (
      <div>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "12px",
          }}
        >
          {selectedPage.name}
        </h1>
        <div style={{ marginBottom: "20px", lineHeight: "1.6" }}>
          <p>
            <strong>Fans:</strong> {selectedPage.fan_count ?? "N/A"}
          </p>
          <p>
            <strong>Followers:</strong> {selectedPage.followers_count ?? "N/A"}
          </p>
          <p>
            <strong>Location:</strong> {selectedPage.location?.city ?? "N/A"}
          </p>
          <p>
            <strong>Engagement:</strong> {selectedPage.engagement?.count ?? "N/A"}
          </p>
        </div>
        <div>
          <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>
            Artist's Choices
          </h2>
          {userChoices.length > 0 ? (
            userChoices.map((choice, i) => {
              let parsed = choice;
              if (typeof choice === "string") {
                try {
                  parsed = JSON.parse(choice);
                } catch (e) {
                  // fallback to string
                }
              }
              return (
                <div key={i} style={{ marginBottom: "20px", lineHeight: "1.6", background: "#f5f5f5", borderRadius: "8px", padding: "10px" }}>
                  {typeof parsed === "object" && parsed !== null ? (
                    Object.entries(parsed).map(([k, v]) => (
                      <p key={k} style={{
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                        textWrap: "wrap",
                        overflowWrap: "anywhere",
                        margin: 0,
                        marginBottom: "6px"
                      }}>
                        <strong>{k.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}:</strong> {String(v)}
                      </p>
                    ))
                  ) : (
                    <p>{String(choice)}</p>
                  )}
                </div>
              );
            })
          ) : (
            <p style={{ color: "#777" }}>No choices made yet.</p>
          )}
          <button
            onClick={onAddChoice}
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              background: "#4267B2",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            Add Choice
          </button>
        </div>
      </div>
    ) : (
      <p>No page selected</p>
    )}
  </aside>
  );
};

export default Sidebar;
