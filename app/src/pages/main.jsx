import { useNavigate } from "react-router";
import { useSelectedPage } from "../components/SelectedPageContext";
import { useState } from "react";

const Main = () => {
  const { selectedPage } = useSelectedPage();
  const [userChoices, setUserChoices] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => window.location.reload();

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", fontFamily: "Lora, serif" }}>
      {/* Header */}
      <header
        style={{
          padding: "12px 24px",
          background: "#4267B2",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        <nav>
          <ul
            style={{
              listStyleType: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              gap: "12px",
            }}
          >
            {["Dashboard", "Post Guidance"].map((item, i) => (
              <li
                key={i}
                style={{
                  cursor: "pointer",
                  padding: "8px 14px",
                  background: "white",
                  color: "black",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#f5f5f5")}
                onMouseOut={(e) => (e.currentTarget.style.background = "white")}
              >
                <a onClick={() => navigate("/")}>{item}</a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          style={{
            background: "blue",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#244e9d")}
          onMouseOut={(e) => (e.currentTarget.style.background = "blue")}
        >
          Logout
        </button>
      </header>

      {/* Layout */}
      <section style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <aside
          style={{
            minWidth: "240px",
            background: "#f9f9f9",
            padding: "16px",
            borderRight: "1px solid #ddd",
            overflowY: "auto",
          }}
        >
          {selectedPage ? (
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "12px" }}>
                {selectedPage.name}
              </h1>
              <div style={{ marginBottom: "20px", lineHeight: "1.6" }}>
                <p><strong>Fans:</strong> {selectedPage.fan_count ?? "N/A"}</p>
                <p><strong>Followers:</strong> {selectedPage.followers_count ?? "N/A"}</p>
                <p><strong>Location:</strong> {selectedPage.location?.city ?? "N/A"}</p>
                <p><strong>Engagement:</strong> {selectedPage.engagement?.count ?? "N/A"}</p>
              </div>

              <div>
                <h2 style={{ fontSize: "18px", marginBottom: "8px" }}>Artist's Choices</h2>
                {userChoices.length > 0 ? (
                  <ul style={{ paddingLeft: "18px", marginBottom: "8px" }}>
                    {userChoices.map((choice, i) => (
                      <li key={i}>{choice}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "#777" }}>No choices made yet.</p>
                )}
                <button
                  onClick={() => {
                    const newChoice = prompt("Enter your choice:");
                    if (newChoice) setUserChoices([...userChoices, newChoice]);
                  }}
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

        {/* Main + Chat */}
        <div style={{ display: "flex", flex: 1, transition: "all 0.3s ease-in-out" }}>
          {/* Main Content */}
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

            {/* Chat Button */}
            {!chatOpen && (
              <button
                onClick={() => setChatOpen(true)}
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

          {/* Chat Box */}
          {chatOpen && (
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
                onClick={() => setChatOpen(false)}
              >
                ✕
              </button>
              <div style={{ marginTop: "50px" }}>Chat content goes here...</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Main;
